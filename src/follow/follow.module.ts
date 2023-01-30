import { Module } from '@nestjs/common';
import { FollowController } from './controller/follow.controller';
import { FollowService } from './repository/follow.service';
import { FollowRepository } from './repository/follow.repository';

@Module({
  controllers: [FollowController],
  providers: [FollowService, FollowRepository],
  exports:[FollowService]
})
export class FollowModule {}
