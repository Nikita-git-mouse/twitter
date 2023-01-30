import { IRecord } from '../../../records/entity/record.model';
import { IUser } from '../../../users/entity/user.model';
import { IWall } from '../../entity/wall.model';

export interface CreateWallParams {
  access?: boolean;
  user: IUser;
}

export interface CreateWallResult {
  data: IWall;
}

export interface ChangeWallAccessParams {
  userId: number;
}

export type ChangeWallAccessResult = undefined;

export interface GetWallByUserIdParams {
  userId: number;
}

export type GetWallByUserIdResult = {
  data: IWall;
};

export interface AssociateRecordWithWallParams {
  record: IRecord;
  userId: number;
}

export type AssociateRecordWithWallResult = undefined;
