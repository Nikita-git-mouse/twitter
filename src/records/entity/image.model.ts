import { IRecord } from "./record.model";

export interface IImage {
    id: number;
    record: IRecord;
    pathToFile: string;
    type: string;
  }