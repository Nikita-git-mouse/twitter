import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { IRecordPermission } from './models';

import { UserEntity } from '../../users/entity/user.entity'; // ************
import { RecordEntity } from '../../records/entity/record.entity';

@Entity()
export class RecordPermissionEntity implements IRecordPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { cascade: true })
  @JoinColumn()
  specificUser: UserEntity;

  @ManyToOne(() => RecordEntity, { cascade: true })
  @JoinColumn()
  record: RecordEntity;

  @Column({ default: true })
  access: boolean;
}
