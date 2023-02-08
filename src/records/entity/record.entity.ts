import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, Tree, TreeChildren, TreeParent, OneToMany} from 'typeorm';
import { IRecord } from './record.model';
import { WallEntity } from '../../records-wall/entity/wall.entity';
import { ImageEntity } from './image.entity';
import { LikeEntity } from 'src/likes/entity/likes.entity';


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

  @Column({ default: false })
  isComment: boolean;
  
  @Column({ default: false })
  isRetweet: boolean;

  @ManyToOne(() => RecordEntity, (entity) => entity.twitterRecords, { nullable: true })
  @TreeParent()
  parentRecord: RecordEntity | null;

  @OneToMany(() => RecordEntity, (entity) => entity.parentRecord)
  @TreeChildren()
  twitterRecords: RecordEntity[];

  @Column({ default: true })
  access: boolean;

  @OneToMany(() => ImageEntity, (entity) => entity.record)
  images: ImageEntity[];

  @OneToMany(() => LikeEntity, (entity) => entity.record)
  likes: LikeEntity[];

}
