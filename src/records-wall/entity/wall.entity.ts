import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IWall } from './wall.model';
import { UserEntity } from '../../users/entity/user.entity'; // ************
import { RecordEntity } from '../../records/entity/record.entity';

@Entity()
export class WallEntity implements IWall {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => RecordEntity, (entity) => entity.wall, { cascade: true })
  records: Array<RecordEntity>;

  @Column({ default: true })
  access: boolean;
}
