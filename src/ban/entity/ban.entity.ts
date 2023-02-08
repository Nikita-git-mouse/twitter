import {
    Entity,
    ManyToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { UserEntity } from '../../users/entity/user.entity'; // ************
import { IBan } from './ban.model';

@Entity()
export class BanEntity implements IBan {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity)
  bannedUser: UserEntity;

  @ManyToOne(() => UserEntity)
  banningUser: UserEntity;
}