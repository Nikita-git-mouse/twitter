import { IUser } from '../../users/entity/user.model';

export interface IFollow {
  id: number;
  follower: IUser;
  following: IUser;
}
