import { ReadStream } from 'fs';
import { IRecord } from '../entity/record.model';

export interface AddRecordParams {
  userId: number;
  fileName: string;
  access: boolean;
  file: Express.Multer.File;

}


export interface AddRetweetParams {
  userId: number;
  fileName: string;
  access: boolean;
  file: Express.Multer.File;
  recordId: IRecord;
}

export interface AddRecordResult {
  data: IRecord;
}

export interface GetAllRecordsParams {
  userId: number;
}

export interface GetAllRetweetsParams {
  userId: number;
}


export interface GetAllRecordsResult {
  data: Array<IRecord>;
}

export interface GetRecordParams {
  userId: number;
  recordId: number;
}

export interface GetRecordResult {
  data: IRecord;
}

export interface GetAllAccessedRecordsByUserIdParams {
  fromUserId: number;
  userId: number;
}

export interface GetAllAccessedRecordsByUserIdResult {
  data: Array<IRecord>;
}

export interface GetByUserIdAndRecordIdParams {
  userId: number;
  fromUserId: number;
  recordId: number;
}

export interface GetByUserIdAndRecordIdResult {
  data: IRecord;
}

export interface GetRecordSourceParams {
  userId: number;
  recordId: number;
}

export interface GetRecordSourceResult {
  data: ReadStream;
}

export interface GetUserRecordSourceParams {
  userId: number;
  recordId: number;
  fromUserId: number;
}

export interface GetUserRecordSourceResult {
  data: ReadStream;
}

export interface DeleteRecordParams {
  userId: number;
  recordId: number;
}

export type DeleteRecordResult = undefined;

// export interface UpdateRecordParams {
//   userId: number;
//   recordId: number;
//   data: Partial<Pick<IRecord, 'access' | 'name'>>;
// }

export interface UpdateRecordResult {
  data: IRecord;
}

export interface ChangeAccessPolicyParams {
  userId: number;
  recordId: number;
}

export type ChangeAccessPolicyResult = undefined;
