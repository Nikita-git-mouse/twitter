import { Redis, InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { SESSION_ID_COOKIE_NAME_TOKEN } from '../core';

@Injectable()
export class JwtMiddleware implements NestMiddleware {
  constructor(
    @InjectRedis()
    private readonly redis: Redis,
  ) {}

  async use(req: Request, res: Response, next: (error?: any) => void) {
    const sessionId = req.cookies[SESSION_ID_COOKIE_NAME_TOKEN];

    if (!sessionId) {
      return next();
    }

    const text = await this.redis.get(sessionId);

    if (!text) {
      return next();
    }

    try {
      const user = JSON.parse(text);

      req.user = { sessionId, ...user };
    } catch {}
    return next();
  }
}
