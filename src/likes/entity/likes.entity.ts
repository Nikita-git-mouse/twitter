import {
    Column,
    Entity,
    JoinColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
  } from 'typeorm';
  
import { UserEntity } from '../../users/entity/user.entity'; // ************
import { RecordEntity } from '../../records/entity/record.entity';
import { ILike } from './likes.model';
  
  @Entity()
  export class LikeEntity implements ILike {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => RecordEntity, (record) => record.likes)
    record: RecordEntity;
  
    @ManyToOne(() => UserEntity)
    user: UserEntity;
  }