import { Module } from '@nestjs/common';
import { WallModule } from '../records-wall/wall.module';
import {
  WallPermissionService,
  RecordPermissionService,
} from './repository';
import { WallPermissionDomain, RecordPermissionDomain } from './access';
import {
  WallPermissionRepository,
  RecordPermissionRepository,
} from './repository/repositories';
import {
  WallPermissionController,
  RecordPermissionController,
} from './controller';

@Module({
  controllers: [WallPermissionController, RecordPermissionController],
  imports: [WallModule],
  providers: [
    WallPermissionService,
    RecordPermissionService,
    WallPermissionRepository,
    RecordPermissionRepository,
    RecordPermissionDomain,
    WallPermissionDomain,
  ],
  exports: [WallPermissionService, RecordPermissionService],
})
export class PermissionModule {}
