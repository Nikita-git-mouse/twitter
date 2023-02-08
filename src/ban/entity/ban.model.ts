import { IUser } from '../../users/entity/user.model';

export interface IBan {
  id: number;
  bannedUser: IUser;
  banningUser: IUser;
}
