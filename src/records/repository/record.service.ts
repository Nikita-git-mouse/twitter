import {
  BadRequestException,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WallService } from '../../records-wall/repository/wall.service';
import {
  WallPermissionService,
  RecordPermissionService,
} from '../../permissions';
import { FileStorageService } from '../filestorage';
import { RecordRepository } from './record.repository';

import {
  ChangeAccessPolicyParams,
  ChangeAccessPolicyResult,
  DeleteRecordParams,
  DeleteRecordResult,
  GetRecordParams,
  GetRecordResult,
} from './record-service.types';
import { ChildEntity } from 'typeorm';

@Injectable()
export class RecordService {
  constructor(
    private readonly recordsRepository: RecordRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly wallService: WallService,
    private readonly wallPermissionService: WallPermissionService,
    private readonly recordsPermissionService: RecordPermissionService,
    private readonly eventEmmiter: EventEmitter2,
  ) {}



  async getRecord(params: GetRecordParams): Promise<GetRecordResult> {
    const { userId, recordId } = params;

    const wall = await this.wallService.getByUserId({ userId });

    if (!wall.data) {
      throw new BadRequestException(`user with id <${userId}> not found`);
    }

    const record = await this.recordsRepository.findOne({
      where: {
        id: recordId,
        wall: {
          id: wall.data.id,       
        },
      },
    });

    if (!record) {
      throw new BadRequestException(`record with id <${recordId}> not found`);
    }

    return {
      data: record,
    };
  }


  async changeAccessPolicy(
    params: ChangeAccessPolicyParams,
  ): Promise<ChangeAccessPolicyResult> {
    const { userId, recordId } = params;

    const record = await this.getRecord({ recordId, userId });

    await this.recordsRepository.update(
      { id: record.data.id },
      { access: !record.data.access },
    );

    return;
  }

  async deleteRecord(params: DeleteRecordParams): Promise<DeleteRecordResult> {
    const { userId, recordId } = params;

    const record = await this.getRecord({ recordId, userId });

    await this.recordsRepository.delete({ id: record.data.id });

    await this.fileStorageService.deleteFile(record.data.pathToFile);

    return;
  }
}
