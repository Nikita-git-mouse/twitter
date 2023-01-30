import { Module } from '@nestjs/common';
import { RecordController } from './controller';
import { RecordService } from './repository';
import { FileStorageService } from './filestorage';
import { RecordRepository } from './repository/record.repository';
import { WallModule } from '../records-wall/wall.module';
import { PermissionModule } from '../permissions';

@Module({
  controllers: [RecordController],
  providers: [RecordService, RecordRepository, FileStorageService],
  imports: [WallModule, PermissionModule],
  exports: [RecordService],
})
export class RecordModule {}
