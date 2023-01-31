import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { UserEntity } from '../../users/entity/user.entity';

import { SessionEntity } from '../../sessions/session.entity';

@Entity()
export class RefreshTokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  user: UserEntity;

  @ManyToOne(() => SessionEntity, { onDelete: 'CASCADE' })
  @JoinColumn()
  session: SessionEntity;

  @Column({ default: '' })
  refreshToken: string;
}
