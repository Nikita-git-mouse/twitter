import { IWall } from 'src/records-wall/entity/wall.model';
import { ImageEntity } from './image.entity';
import { IImage } from './image.model';


export interface IRecord {
  id: number;
  wall: IWall;
  text: string;
  isComment: boolean;
  isRetweet: boolean;
  parentRecord: IRecord | null;
  twitterRecords: IRecord[];
  access: boolean;
  images: IImage[];
}

// export interface IRecord {
//   id: number;
//   wall: IWall;
//   pathToFile?: string;
//   access?: boolean;
//   type: string;
//   text: string;
//   isComment: boolean;
//   isRetweet: boolean;
//   parentRecord: IRecord;
// }
