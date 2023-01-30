import { Module } from '@nestjs/common';
import { UsersController } from './controller/users.controller';
import { UsersService } from './repository';
import { UserRepository } from './repository/user.repository';
import { WallModule } from '../records-wall/wall.module';

@Module({
  controllers: [UsersController],
  providers: [UsersService, UserRepository],
  imports: [WallModule],
  exports: [UsersService],
})
export class UsersModule {}
