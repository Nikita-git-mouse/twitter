import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IWallPermission } from './models';
import { UserEntity } from '../../users/entity/user.entity'; // ************
import { WallEntity } from '../../records-wall/entity/wall.entity';

@Entity()
export class WallPermissionEntity implements IWallPermission {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { cascade: true })
  @JoinColumn()
  specificUser: UserEntity;

  @ManyToOne(() => WallEntity, { cascade: true })
  @JoinColumn()
  wall: WallEntity;

  @Column({ default: true })
  access: boolean;
}
