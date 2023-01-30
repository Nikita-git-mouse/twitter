import { IRecord } from '../../../records/entity/record.model';

export interface GetAccessedRecordsToUserParams {
  records: Array<IRecord>;
  userId: number;
}

export type GetAccessedRecordsToUserResult = {
  records: Array<IRecord>;
};

export interface CheckAccessToUserParams {
  record: IRecord;
  userId: number;
}

export type CheckAccessToUserResult = boolean;
