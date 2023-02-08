import { Module } from '@nestjs/common';
import { BanController } from './controller/ban.controller';
import { BanRepository } from './repository/ban.repository';
import { BanService } from './repository/ban.service';

@Module({
  controllers: [BanController],
  providers: [BanService, BanRepository],
  exports:[BanService]
})
export class BanModule {}
