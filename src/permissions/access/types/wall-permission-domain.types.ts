import { IWall } from '../../../records-wall/entity/wall.model';

export interface CheckAccessToWallParams {
  wall: IWall;
  userId: number;
}

export type CheckAccessToWallResult = boolean;
