import { IUser } from '../../users/entity/user.model';

export interface UserSignUpParams extends Omit<IUser, 'id' | 'profileUri'> {
  password: string;
}

export type UserSignUpResult = undefined;

export interface UserSignInParams {
  email: string;
  password: string;
}

export type UserSignInResult = {
  data: {
    sessionId: string;
    refreshToken: string;
  };
};

export interface UserSignOutParams {
  userId: number;
  sessionId: string;
}

export type UserSignOutResult = undefined;

export interface UserRefreshTokenParams {
  refreshToken: string;
}

export type UserRefreshTokenResult = {
  data: {
    sessionId: string;
    refreshToken: string;
  };
};

export interface VerifyEmailParams {
  token: string;
}

export type VerifyEmailResult = undefined;
