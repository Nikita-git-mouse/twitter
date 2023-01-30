import { IWall } from 'src/records-wall/entity/wall.model';


export interface IRecord {
  id: number;
  wall: IWall;
  text: string;
  isComment: boolean;
  isRetweet: boolean;
  parentRecord: IRecord;
  twitterRecords: IRecord[];
  pathToFile: string;
  access: boolean;
  type: string;
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
