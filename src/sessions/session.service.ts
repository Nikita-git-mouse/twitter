import { InjectRedis } from '@nestjs-modules/ioredis';
import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { In } from 'typeorm';
import { UserEntity } from '../users/entity/user.entity';
import { SessionRepository } from './session.repository';

@Injectable()
export class SessionService {
  constructor(
    private readonly sessionRepository: SessionRepository,
    @InjectRedis() private readonly redis: Redis,
  ) {}

  async createSession(sessionId: string, user: UserEntity, payload: string) {
    const expriedAt = Date.now() + 10000000;

    const session = await this.sessionRepository.save({
      user,
      expiredAt: new Date(expriedAt),
      sessionId,
    });

    await this.redis.set(sessionId, payload);

    return session;
  }

  async deleteLastSession(userId: number) {
    const sessions = await this.sessionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
      order: {
        id: {
          direction: 'DESC',
        },
      },
    });

    if (sessions.length > 0) {
      const [session] = sessions;

      await this.sessionRepository.delete({ id: session.id });
      await this.redis.del(session.sessionId);
    }
  }

  async deleteSessionById(userId: number, sessionId: string) {
    await this.sessionRepository.delete({
      sessionId,
      user: { id: userId },
    });
    await this.redis.del(sessionId);
  }

  async getAll(userId: number) {
    const sessions = await this.sessionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return sessions;
  }

  async deleteAllSessions(userId: number) {
    const sessions = await this.sessionRepository.find({
      where: {
        user: {
          id: userId,
        },
      },
    });

    if (sessions.length) {
      await this.sessionRepository.delete(
        sessions.map((session) => session.id),
      );

      for (const session of sessions) {
        await this.redis.del(session.sessionId);
      }
    }
  }

  async countSessions(userId: number) {
    const countSession = await this.sessionRepository.count({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return countSession;
  }
}
