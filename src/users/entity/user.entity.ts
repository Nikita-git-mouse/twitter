import { FollowEntity } from 'src/follow/entity/follow.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IUser } from './user.model';

@Entity()
export class UserEntity implements IUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false })
  surname: string;

  @Column({ nullable: false })
  middleName: string;
}
