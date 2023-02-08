import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, OneToMany} from 'typeorm';
import { IRecord } from './record.model';
import { WallEntity } from '../../records-wall/entity/wall.entity';


// @Entity()
// export class RecordEntity implements IRecord {
//   @PrimaryGeneratedColumn()
//   id: number;

//   @ManyToOne(() => WallEntity, (entity) => entity.records)
//   wall: WallEntity;

//   @Column({ nullable: false })
//   name: string;

//   @Column({ default: true })
//   access: boolean;

//   @Column({ nullable: false, unique: true })
//   pathToFile: string;

//   @Column({ default: true })
//   type: string;
// }
@Entity({name: 'Records'})
@Tree('materialized-path')
export class RecordEntity implements IRecord{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => WallEntity, (entity) => entity.records)
  wall: WallEntity;

  @Column('text')
  text: string;

  @Column({ default: true })
  isComment: boolean;
  
  @Column({ default: false })
  isRetweet: boolean;

  @TreeParent()
  parentRecord: RecordEntity;
  
  @TreeChildren()
  // @OneToMany(() => RecordEntity, (entity) => entity.parentRecord)
  twitterRecords: RecordEntity[];

  @Column({ default: true })
  access: boolean;

  // @OneToMany(type => Like, like => like.twitterRecord)
  // likes: Like[];
  
  @Column({ nullable: false, unique: true })
  pathToFile: string;

  @Column({ default: true })
  type: string;
  
}
