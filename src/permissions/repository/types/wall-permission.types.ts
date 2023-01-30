import { IWall } from '../../../records-wall/entity/wall.model';
import { IWallPermission } from '../../access';

export interface CheckUserPermissionToWallParams {
  wall: IWall;
  userId: number;
}

export type CheckUserPermissionToWallResult = boolean;

export interface GetAllByUserIdParams {
  userId: number;
}

export interface GetAllByUserIdResult {
  data: Array<IWallPermission>;
}

export interface DeletePermissionParams {
  userId: number;
  specificUserId: number;
}

export type DeletePermissionResult = undefined;

export interface UpdatePermissionParams {
  access: boolean;
  userId: number;
  specificUserId: number;
}

export interface UpdatePermissionResult {
  data: IWallPermission;
}
