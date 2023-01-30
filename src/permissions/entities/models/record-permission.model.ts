import { IUser } from '../../../users/entity/user.model';
import { IRecord } from '../../../records/entity/record.model';

export interface IRecordPermission {
  id: number;
  specificUser: IUser;
  record: IRecord;
  access: boolean;
}
