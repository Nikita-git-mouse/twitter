import { Inject } from '@nestjs/common';

import { RecordPermissionRepository } from '../repository/repositories';
import {
  CheckAccessToUserParams,
  CheckAccessToUserResult,
  GetAccessedRecordsToUserParams,
  GetAccessedRecordsToUserResult,
} from './types';

import { IRecordPermissionRepository } from './interfaces';

export class RecordPermissionDomain {
  constructor(
    @Inject(RecordPermissionRepository)
    private readonly recordPermissionStore: IRecordPermissionRepository,
  ) {}

  async getAccessedRecordsToUser(
    params: GetAccessedRecordsToUserParams,
  ): Promise<GetAccessedRecordsToUserResult> {
    const { records, userId } = params;

    const recordsIds: Array<number> = records.map((record) => record.id);

    const recordsPermissions =
      await this.recordPermissionStore.getByUserIdAndRecordsId(
        userId,
        recordsIds,
      );

    return {
      records: records.filter((record) => {
        const recordPermission = recordsPermissions.find(
          (obj) => obj.id === record.id,
        );

        if (recordPermission) {
          return recordPermission.access;
        }

        return record.access;
      }),
    };
  }

  async checkAccessToUser(
    params: CheckAccessToUserParams,
  ): Promise<CheckAccessToUserResult> {
    const { record, userId } = params;

    const recordPermission =
      await this.recordPermissionStore.getByUserIdAndRecordId(
        userId,
        record.id,
      );

    if (recordPermission) {
      return recordPermission.access;
    }

    return record.access;
  }
}
