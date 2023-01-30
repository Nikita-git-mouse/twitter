import { Module } from '@nestjs/common';
import { LikesController } from './controller/likes.controller';
import { LikesRepository } from './repository/likes.repository';
import { LikesService } from './repository/likes.service';

@Module({
  controllers: [LikesController],
  providers: [LikesService,LikesRepository],
  exports:[LikesService]
})
export class LikesModule {}
