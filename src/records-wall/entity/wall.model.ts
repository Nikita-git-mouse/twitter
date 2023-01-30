import { IRecord } from '../../records/entity/record.model';
import { IUser } from '../../users/entity/user.model';

export interface IWall {
  id: number;
  user: IUser;
  access: boolean;
  records: Array<IRecord>;
}
