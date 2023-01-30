import { IRecord } from 'src/records/entity/record.model';
import { IUser } from '../../users/entity/user.model';

export interface ILike {
  id: number;
  record: IRecord;
  user: IUser;
}
