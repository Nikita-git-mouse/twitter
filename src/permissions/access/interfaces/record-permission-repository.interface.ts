import { IRecordPermission } from '../../entities/models';

export interface IRecordPermissionRepository {
  getByUserIdAndRecordsId: (
    userId: number,
    recordsIds: Array<number>,
  ) => Promise<Array<IRecordPermission>>;

  getByUserIdAndRecordId: (
    userId: number,
    recordId: number,
  ) => Promise<IRecordPermission>;
}
