import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IObject } from '../../domain';
import { GalleryEntity } from '../../../gallery/infrasturcture/entities';

@Entity({ name: 'gallery' })
export class ObjectEntity implements IObject {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => GalleryEntity, (entity) => entity.objects)
  gallery: GalleryEntity;

  @Column({ nullable: false })
  name: string;

  @Column({ nullable: false, unique: true })
  pathToFile: string;

  @Column({ default: true })
  type: string;
}
