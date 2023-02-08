import { Column, Entity, ManyToOne, PrimaryGeneratedColumn} from 'typeorm';
import { IImage } from './image.model';
import { RecordEntity } from './record.entity'; 
import { IRecord } from './record.model';


@Entity({name: 'Images'})
export class ImageEntity implements IImage{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => RecordEntity, (entity) => entity.images)
  record: RecordEntity;

  @Column({ nullable: false, unique: true })
  pathToFile: string;

  @Column({ default: true })
  type: string;
}