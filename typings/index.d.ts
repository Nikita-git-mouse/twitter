import {} from '../config';
import { JwtPayload } from '../src/auth/core';

interface RefreshPayload extends JwtPayload {
  refreshToken: string;
  sessionId: string;
}

declare global {
  namespace Express {
    interface Request {
      user: JwtPayload;
      refresh: RefreshPayload;
    }
  }
}

declare module '@nestjs/config' {
  class ConfigService<Config extends Record<unknown, Record<string, unknown>>> {
    public get<ConfigKey extends keyof Config>(
      parameter: ConfigKey,
    ): Config[ConfigKey];
  }
}
