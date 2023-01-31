import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiExcludeEndpoint, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthService } from '../repository';
import {
  REFRESH_TOKEN_COOKIE_NAME_TOKEN,
  SESSION_ID_COOKIE_NAME_TOKEN,
} from '../core';
import { RefreshTokenGuard } from '../guards/refresh-token.guard';
import { UserSignInInput, UserSignUpInput } from './inputs';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  async singUp(@Body() input: UserSignUpInput) {
    await this.authService.signUp(input);
  }

  @ApiExcludeEndpoint()
  @Get('/verify')
  async verifyEmail(@Query('token') token: string) {
    await this.authService.verifyEmail({ token });

    return;
  }

  @Post('/sign-in')
  async singIn(
    @Body() input: UserSignInInput,
    @Res({ passthrough: true }) response: Response,
  ) {
    const { data } = await this.authService.singIn(input);

    const { sessionId, refreshToken } = data;

    this.setSessionId(response, sessionId);
    this.setRefreshToken(response, refreshToken);
  }

  @Post('/sign-out')
  @UseGuards(RefreshTokenGuard)
  async signOut(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const { id, sessionId } = request.refresh;

    await this.authService.signOut({
      sessionId,
      userId: id,
    });

    this.clearCookies(response);
  }

  @Post('/refresh')
  @UseGuards(RefreshTokenGuard)
  async refresh(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    const { refreshToken } = request.refresh;

    const { data } = await this.authService.refresh({
      refreshToken,
    });

    this.setSessionId(response, data.sessionId);
    this.setRefreshToken(response, data.refreshToken);
  }

  private setRefreshToken(response: Response, refreshToken: string) {
    response.cookie(REFRESH_TOKEN_COOKIE_NAME_TOKEN, refreshToken);
  }
  private setSessionId(response: Response, sessionId: string) {
    response.cookie(SESSION_ID_COOKIE_NAME_TOKEN, sessionId);
  }

  private clearCookies(response: Response) {
    response.clearCookie(REFRESH_TOKEN_COOKIE_NAME_TOKEN);
    response.clearCookie(SESSION_ID_COOKIE_NAME_TOKEN);
  }
}
