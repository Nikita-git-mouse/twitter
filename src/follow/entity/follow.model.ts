import { IUser } from '../../users/entity/user.model';

export interface IFollow {
  id: number;
  subscriber: IUser;
  subscription: IUser;
}
