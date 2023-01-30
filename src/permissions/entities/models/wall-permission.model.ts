import { IUser } from '../../../users/entity/user.model';
import { IWall } from '../../../records-wall/entity/wall.model';

export interface IWallPermission {
  id: number;
  specificUser: IUser;
  wall: IWall;
  access: boolean;
}
