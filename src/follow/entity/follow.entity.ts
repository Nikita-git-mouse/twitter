import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    OneToMany,
    OneToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
  import { UserEntity } from '../../users/entity/user.entity'; // ************
  import { RecordEntity } from '../../records/entity/record.entity';
import { IFollow } from './follow.model';
  
  @Entity()
  export class FollowEntity implements IFollow {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => UserEntity) 
    @JoinColumn({ name: 'follower_id' })
    follower: UserEntity;
  
    @ManyToOne(() => UserEntity)
    @JoinColumn({ name: 'following_id' })
    following: UserEntity;
  }