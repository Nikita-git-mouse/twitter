import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
import { TreeRepository } from 'typeorm';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WallService } from '../../../records-wall/repository/wall.service';
import {
  WallPermissionService,
  RecordPermissionService,
} from '../../../permissions';
import { FileStorageService } from '../../filestorage';
import { RecordRepository } from './record.repository';

import {
  AddRecordParams,
  AddRecordResult,
  AddRetweetParams,
  GetAllAccessedRecordsByUserIdParams,
  GetAllAccessedRecordsByUserIdResult,
  GetAllRecordsParams,
  GetAllRecordsResult,
  GetByUserIdAndRecordIdParams,
  GetByUserIdAndRecordIdResult,
  GetRecordParams,
  GetRecordResult,
  GetRecordSourceParams,
  GetRecordSourceResult,
  GetUserRecordSourceParams,
  GetUserRecordSourceResult,
} from './record-service.types';
import { ChildEntity } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { RecordEntity } from '../../entity/record.entity';



// @Injectable()
// export class RecordService {
//   constructor(
//     @InjectRepository(RecordEntity)
//     private readonly recordRepository: TreeRepository<RecordEntity>,
//   ) {}
@Injectable()
export class CommentService {
  constructor(
    private readonly fileStorageService: FileStorageService,
    private readonly wallService: WallService,
    private readonly wallPermissionService: WallPermissionService,
    private readonly recordsPermissionService: RecordPermissionService,
    private readonly eventEmmiter: EventEmitter2,
    private readonly recordsRepository: RecordRepository,
    
  ) {}
  async addComment(params: AddRetweetParams): Promise<AddRecordResult> {
    const { file, userId, access, fileName, recordId } = params;

    const { extension, filename } =
      await this.fileStorageService.saveFileViaBuffer(file);
    
    
    const parentRecord = await this.recordsRepository.findOne({ where: { id: recordId } });


    const newRecord = await this.recordsRepository.save({
      access,
      text: fileName,
      pathToFile: filename,
      type: extension,
      isComment: false,
      isRetweet: true,
      parentRecord: parentRecord
    });

    this.eventEmmiter.emit('record.created', {
      data: newRecord,
      userId,
    });

    return { data: newRecord };
  }
  
    // async getCommentSource(
    //   params: GetRecordSourceParams,
    // ): Promise<GetRecordSourceResult> {
    //   const { recordId, userId } = params;
  
    //   const record = await this.getComment({ recordId, userId });
  
    //   const stream = await this.fileStorageService.createReadStreamFile(
    //     record.data.pathToFile,
    //   );
  
    //   return { data: stream };
    // }
  
    // async getUserRecordSource(
    //   params: GetUserRecordSourceParams,
    // ): Promise<GetUserRecordSourceResult> {
    //   const { recordId, userId, fromUserId } = params;
  
    //   const record = await this.getByUserIdAndRecordId({
    //     fromUserId,
    //     recordId,
    //     userId,
    //   });
  
    //   const stream = await this.fileStorageService.createReadStreamFile(
    //     record.data.pathToFile,
    //   );
  
    //   return { data: stream };
    // }
  
    async getComment(params: GetRecordParams): Promise<GetRecordResult> {
      const { userId, recordId } = params;
  
      const wall = await this.wallService.getByUserId({ userId });
  
      if (!wall.data) {
        throw new BadRequestException(`user with id <${userId}> not found`);
      }
  
      const record = await this.recordsRepository.findOne({
        where: {
          isComment: true,
          id: recordId,
          wall: {
            id: wall.data.id,       
          },
        },
      });
  
      if (!record) {
        throw new BadRequestException(`comment with id <${recordId}> not found`);
      }
  
      return {
        data: record,
      };
    }
  
    async getAllUserRecords(
      params: GetAllRecordsParams,
    ): Promise<GetAllRecordsResult> {
      const { userId } = params;
  
      const wall = await this.wallService.getByUserId({ userId });
  
      if (!wall.data) {
        throw new BadRequestException(`user with id <${userId}> not found`);
      }
  
      const records = await this.recordsRepository.find({
        where: {
          wall: {
            id: wall.data.id,
          },
        },
      });
  
      return {
        data: records,
      };
    }
      
    async getByUserIdAndRecordId(
      params: GetByUserIdAndRecordIdParams,
    ): Promise<GetByUserIdAndRecordIdResult> {
      const { userId, fromUserId, recordId } = params;
  
      const wall = await this.wallService.getByUserId({
        userId,
      });
  
      if (!wall.data) {
        throw new BadRequestException(`user with id <${userId}> not found`);
      }
  
      if (fromUserId !== userId) {
        const isWallAccessed =
          await this.wallPermissionService.checkUserPermissionToWall({
            wall: wall.data,
            userId,
          });
  
        if (!isWallAccessed) {
          throw new ForbiddenException('access to wall denied');
        }
      }
  
      const record = await this.recordsRepository.findOne({
        where: {
          isComment: true,
          id: recordId,
          wall: {
            id: wall.data.id,
          },
        },
      });
  
      if (!record) {
        throw new BadRequestException(`record with id <${recordId}> not found`);
      }
  
      if (fromUserId === userId) {
        return {
          data: record,
        };
      }
  
      const isAccessed = await this.recordsPermissionService.checkAccessToUser({
        record,
        userId: fromUserId,
      });
  
      if (isAccessed) {
        return {
          data: record,
        };
      }
  
      throw new ForbiddenException('access to this record denied');
    }

async findChildren(recordId: number): Promise<RecordEntity[]> {
  const record = await this.recordsRepository.findOne({ 
      where: {
      isComment: true,
      id: recordId,
    }, });
  return this.recordsRepository.findDescendants(record);
}
}