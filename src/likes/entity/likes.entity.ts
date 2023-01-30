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
  
    @ManyToOne(() => UserEntity) 
    //@JoinColumn({ name: 'record_id' })
    record: RecordEntity;
  
    @ManyToOne(() => UserEntity)
    //@JoinColumn({ name: 'user_id' })
    user: UserEntity;
  }