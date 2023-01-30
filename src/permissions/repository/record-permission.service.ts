import { BadRequestException, Injectable } from '@nestjs/common';

import {
  CheckAccessToUserParams,
  CheckAccessToUserResult,
  CheckUserPermissionToRecordsParams,
  CheckUserPermissionToRecordsResult,
  DeleteRecordPermissionParams,
  DeleteRecordPermissionResult,
  GetAllRecordPermissionsByUserIdParams,
  GetAllRecordPermissionsByUserIdResult,
  UpdateRecordPermissionParams,
  UpdateRecordPermissionResult,
} from './types';
import { RecordPermissionRepository } from './repositories';
import { RecordPermissionDomain } from '../access';
import { WallService } from '../../records-wall/repository/wall.service';

@Injectable()
export class RecordPermissionService {
  constructor(
    private readonly wallService: WallService,
    private readonly recordPermissionRepository: RecordPermissionRepository,
    private readonly recordPermissionDomain: RecordPermissionDomain,
  ) {}

  async getAllByUserId(
    params: GetAllRecordPermissionsByUserIdParams,
  ): Promise<GetAllRecordPermissionsByUserIdResult> {
    const { userId } = params;

    const wall = await this.wallService.getByUserId({ userId });

    const permissions = await this.recordPermissionRepository.find({
      where: {
        record: {
          wall: {
            id: wall.data.id,
          },
        },
      },
    });

    return {
      data: permissions,
    };
  }

  async deletePermission(
    params: DeleteRecordPermissionParams,
  ): Promise<DeleteRecordPermissionResult> {
    const { userId, specificUserId, recordId } = params;

    const wall = await this.wallService.getByUserId({ userId });

    const permission = await this.recordPermissionRepository.findOne({
      where: {
        record: {
          id: recordId,
          wall: {
            id: wall.data.id,
          },
        },
        specificUser: {
          id: specificUserId,
        },
      },
    });

    if (!permission) {
      throw new BadRequestException(`record or user with their id not found`);
    }

    await this.recordPermissionRepository.delete({ id: permission.id });

    return;
  }

  async updatePermission(
    params: UpdateRecordPermissionParams,
  ): Promise<UpdateRecordPermissionResult> {
    const { userId, specificUserId, recordId, access } = params;

    const wall = await this.wallService.getByUserId({ userId });

    const permission = await this.recordPermissionRepository.findOne({
      where: {
        record: {
          wall: {
            id: wall.data.id,
          },
          id: recordId,
        },
        specificUser: {
          id: specificUserId,
        },
      },
    });

    let raw: any;
    if (permission) {
      const data = await this.recordPermissionRepository.update(
        { id: permission.id },
        {
          access,
        },
      );

      raw = data.raw;
    } else {
      const newPermission = await this.recordPermissionRepository.save({
        id: permission.id,
        access,
        record: {
          id: recordId,
        },
        specificUser: {
          id: specificUserId,
        },
      });

      raw = newPermission;
    }

    return { data: raw };
  }

  async getAccessedRecordsToUser(
    params: CheckUserPermissionToRecordsParams,
  ): Promise<CheckUserPermissionToRecordsResult> {
    const { userId, records } = params;

    return this.recordPermissionDomain.getAccessedRecordsToUser({
      records,
      userId,
    });
  }

  async checkAccessToUser(
    params: CheckAccessToUserParams,
  ): Promise<CheckAccessToUserResult> {
    const { userId, record } = params;

    return this.recordPermissionDomain.checkAccessToUser({ record, userId });
  }
}
