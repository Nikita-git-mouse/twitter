import { Module } from '@nestjs/common';
import { WallController } from './controller/wall.controller';
import { WallService } from './repository/wall.service';
import { WallRepository } from './repository/wall.repository';

@Module({
  controllers: [WallController],
  providers: [WallService, WallRepository],
  imports: [],
  exports: [WallService],
})
export class WallModule {}
