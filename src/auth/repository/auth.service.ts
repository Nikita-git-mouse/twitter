import {
  InternalServerErrorException,
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import { genSalt, hash } from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../../users';
import { AuthRepository } from './auth.repository';
import { EmailService } from '../mailer';
import {
  UserRefreshTokenParams,
  UserRefreshTokenResult,
  UserSignInParams,
  UserSignInResult,
  UserSignOutParams,
  UserSignOutResult,
  UserSignUpParams,
  UserSignUpResult,
  VerifyEmailParams,
  VerifyEmailResult,
} from './auth-service.types';
import { JwtPayload, Roles } from '../core';
import { ConfigService } from '@nestjs/config';
import { ConfigInterface } from '../../../config';
import { RefreshTokensRepository } from './refresh-tokens.repository';
import { v4 } from 'uuid';
import { SessionService } from '../../sessions/session.service';
import { RefreshPayload } from '../../../typings';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly authRepository: AuthRepository,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<ConfigInterface>,
    private readonly emailService: EmailService,
    private readonly refreshTokenRepository: RefreshTokensRepository,
    private readonly sessionService: SessionService,
  ) {}

  async signUp(params: UserSignUpParams): Promise<UserSignUpResult> {
    const { email, middleName, name, surname, password } = params;

    try {
      const { data } = await this.userService.createUser({
        email,
        middleName,
        name,
        surname,
      });

      const hashedPassword = await this.hashPassword(password);

      const auth = await this.authRepository.save({
        password: hashedPassword,
        user: data,
      });

      const redirectUri = await this.generateAuthViaEmailRedirectUri({
        id: auth.id,
        role: Roles.User,
      });

      this.emailService.sendAuthMail({
        email,
        name,
        surname,
        redirectUri,
      });
    } catch (error: any) {
      if (error instanceof QueryFailedError) {
        const { message } = error;

        if (message.includes('duplicate key value')) {
          throw new BadRequestException('user already exists');
        }
      }
      throw new InternalServerErrorException('try again later');
    }

    return;
  }

  async singIn(params: UserSignInParams): Promise<UserSignInResult> {
    const { email, password } = params;

    const userCreds = await this.authRepository.findOne({
      where: {
        user: {
          email,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!userCreds) {
      throw new BadRequestException('email or password is invalid');
    }

    if (userCreds.isActivated) {
      const isCompared = await this.comparePasswords(
        password,
        userCreds.password,
      );

      if (isCompared) {
        const countSessions = await this.sessionService.countSessions(
          userCreds.user.id,
        );

        if (countSessions >= 10) {
          await this.sessionService.deleteLastSession(userCreds.user.id);
        }

        const sessionId = `session-${Date.now()}-${v4()}`;
        const payload = JSON.stringify({
          id: userCreds.user.id,
          role: Roles.User,
        });

        const tokens = await this.generateTokens({
          id: userCreds.user.id,
          role: Roles.User,
        });

        const newSession = await this.sessionService.createSession(
          sessionId,
          userCreds.user,
          payload,
        );

        await this.refreshTokenRepository.save({
          refreshToken: tokens.refreshToken,
          session: newSession,
          user: userCreds.user,
        });

        return {
          data: {
            sessionId,
            refreshToken: tokens.refreshToken,
          },
        };
      }

      throw new BadRequestException('email or password is invalid');
    }

    throw new UnauthorizedException('email is not activated');
  }

  async signOut(params: UserSignOutParams): Promise<UserSignOutResult> {
    const { userId, sessionId } = params;

    const userCreds = await this.authRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        user: true,
      },
    });

    if (!userCreds) {
      throw new BadRequestException('email or password is invalid');
    }

    await this.sessionService.deleteSessionById(userId, sessionId);
    await this.refreshTokenRepository.delete({
      session: { sessionId },
      user: { id: userId },
    });

    return;
  }

  async refresh(
    params: UserRefreshTokenParams,
  ): Promise<UserRefreshTokenResult> {
    const { refreshToken } = params;

    const refresh = await this.refreshTokenRepository.findOne({
      where: {
        refreshToken: refreshToken,
      },
      relations: {
        user: true,
        session: true,
      },
    });

    if (!refresh) {
      throw new UnauthorizedException();
    }

    const isVerified = await this.verifyRefreshToken(refreshToken);

    await this.sessionService.deleteSessionById(
      refresh.user.id,
      refresh.session.sessionId,
    );
    await this.refreshTokenRepository.delete({
      id: refresh.id,
    });

    if (!isVerified) {
      throw new UnauthorizedException();
    }

    const payload = {
      id: refresh.user.id,
      role: Roles.User,
    };
    const tokens = await this.generateTokens(payload);

    // await this.authRepository.update(
    //   { id: userCreds.id },
    //   { refreshToken: tokens.refreshToken },
    // );

    const sessionId = `session-${Date.now()}-${v4()}`;

    const newSession = await this.sessionService.createSession(
      sessionId,
      refresh.user,
      JSON.stringify(payload),
    );

    await this.refreshTokenRepository.save({
      refreshToken: tokens.refreshToken,
      session: newSession,
      user: refresh.user,
    });

    return {
      data: {
        sessionId,
        refreshToken: tokens.refreshToken,
      },
    };
  }

  async verifyEmail(params: VerifyEmailParams): Promise<VerifyEmailResult> {
    const { token } = params;

    const isVerified = await this.verifyTokenFromEmail(token);

    if (isVerified) {
      const { id } = isVerified;
      await this.authRepository.update({ id }, { isActivated: true });
    }

    return;
  }

  private async hashPassword(password: string) {
    const salt = await genSalt(8);

    const hashPassword = await hash(password, salt);

    return `${salt}--${hashPassword}`;
  }

  private async comparePasswords(
    comparePassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    const [salt, password] = hashedPassword.split('--');

    return (await hash(comparePassword, salt)) === password;
  }

  private async generateAuthViaEmailRedirectUri(
    payload: JwtPayload,
  ): Promise<string> {
    const { host, port, protocol } = this.configService.get('app');
    const { emailTokenExpiresIn, emailTokenSecretKey } =
      this.configService.get('jwt');

    const token = await this.jwtService.sign(payload, {
      secret: emailTokenSecretKey,
      expiresIn: emailTokenExpiresIn,
    });

    const redirectUri = `${protocol}://${host}:${port}/api/auth/verify?token=${token}`;

    return redirectUri;
  }

  private async verifyTokenFromEmail(token: string) {
    try {
      const { emailTokenSecretKey } = this.configService.get('jwt');

      const paylaod = await this.jwtService.verify<JwtPayload>(token, {
        secret: emailTokenSecretKey,
      });

      return paylaod;
    } catch (error: any) {
      return null;
    }
  }

  private async verifyRefreshToken(token: string): Promise<boolean> {
    try {
      const { refreshTokenSecretKey } = this.configService.get('jwt');

      await this.jwtService.verify<RefreshPayload>(token, {
        secret: refreshTokenSecretKey,
      });

      return true;
    } catch (error: any) {
      return false;
    }
  }

  private async generateTokens(
    payload: Omit<JwtPayload, 'sessionId'>,
  ): Promise<{
    accessToken: string;
    refreshToken: string;
  }> {
    const {
      accessTokenExpiresIn,
      accessTokenSecretKey,
      refreshTokenExpiresIn,
      refreshTokenSecretKey,
    } = this.configService.get('jwt');

    const accessToken = await this.jwtService.sign(payload, {
      secret: accessTokenSecretKey,
      expiresIn: accessTokenExpiresIn,
    });

    const refreshToken = await this.jwtService.sign(payload, {
      secret: refreshTokenSecretKey,
      expiresIn: refreshTokenExpiresIn,
    });

    return {
      accessToken,
      refreshToken,
    };
  }
}
