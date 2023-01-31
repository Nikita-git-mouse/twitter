import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { ConfigInterface, loaders } from '../config';
import { JwtMiddleware } from './auth/middlewares';

import { UsersModule } from './users';
import { AuthModule } from './auth';
import { WallModule } from './records-wall/wall.module';
import { RecordModule } from './records';
import { PermissionModule } from './permissions';

import { UserEntity } from './users/entity/user.entity';
import { AuthEntity } from './auth/entity/auth.entity';
import { WallEntity } from './records-wall/entity/wall.entity';
import { RecordEntity } from './records/entity/record.entity';
import {
  WallPermissionEntity,
  RecordPermissionEntity,
} from './permissions/entities';
import { LikesModule } from './likes/likes.module';
import { FollowModule } from './follow/follow.module';
import { RedisModule } from '@nestjs-modules/ioredis';
import { RefreshTokenEntity } from './auth/entity/refreshTokens.entity';
import { SessionEntity } from './sessions/session.entity';
import { SessionModule } from './sessions/session.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: loaders,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (config: ConfigService<ConfigInterface>) => {
        const { host, password, port, username } = config.get('postgres');

        return {
          synchronize: true,
          port,
          host,
          type: 'postgres',
          migrations: [],
          entities: [
            RefreshTokenEntity,
            SessionEntity,
            UserEntity,
            AuthEntity,
            WallEntity,
            RecordEntity,
            RecordPermissionEntity,
            WallPermissionEntity,
          ],
          username,
          password,
        };
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      global: true,
      newListener: true,
      removeListener: true,
      verboseMemoryLeak: true,
    }),
    UsersModule,
    PermissionModule,
    RecordModule,
    AuthModule,
    WallModule,
    JwtModule,
    SessionModule,
    // FollowModule,
    // LikesModule,
    RedisModule.forRoot({
      config: {
        url: 'redis://localhost:8379',
      },
    }),
  ],
  providers: [JwtMiddleware],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(JwtMiddleware).forRoutes('*');
  }
}
