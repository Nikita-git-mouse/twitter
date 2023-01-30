import { IWall } from '../../../records-wall/entity/wall.model';
import { IRecord } from '../../../records/entity/record.model';
import { IRecordPermission } from '../../access';

export interface CheckUserPermissionToRecordsParams {
  records: Array<IRecord>;
  userId: number;
}

export type CheckUserPermissionToRecordsResult = {
  records: Array<IRecord>;
};

export interface CheckAccessToUserParams {
  record: IRecord;
  userId: number;
}

export type CheckAccessToUserResult = boolean;

export interface GetAllRecordPermissionsByUserIdParams {
  userId: number;
}

export interface GetAllRecordPermissionsByUserIdResult {
  data: Array<IRecordPermission>;
}

export interface DeleteRecordPermissionParams {
  userId: number;
  recordId: number;
  specificUserId: number;
}

export type DeleteRecordPermissionResult = undefined;

export interface UpdateRecordPermissionParams {
  access: boolean;
  userId: number;
  recordId: number;
  specificUserId: number;
}

export interface UpdateRecordPermissionResult {
  data: IRecordPermission;
}
