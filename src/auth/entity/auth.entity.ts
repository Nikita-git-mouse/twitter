import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../users/entity/user.entity';

import { IAuth } from './auth.model';

@Entity()
export class AuthEntity implements IAuth {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => UserEntity, { cascade: true })
  @JoinColumn()
  user: UserEntity;

  @Column({ default: false })
  isActivated: boolean;

  @Column({ nullable: false })
  password: string;

  @Column({ default: '' })
  refreshToken: string;
}
