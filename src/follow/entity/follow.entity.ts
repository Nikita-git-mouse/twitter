import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity'; // ************
import { IFollow } from './follow.model';

@Entity()
export class FollowEntity implements IFollow {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  subscriber: UserEntity;

  @ManyToOne(() => UserEntity)
  subscription: UserEntity;
}