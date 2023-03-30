import {
    BadRequestException,
    ForbiddenException,
    Injectable,
} from '@nestjs/common';
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
  GetAllRetweetsParams,
  GetByUserIdAndRecordIdParams,
  GetByUserIdAndRecordIdResult,
  GetRecordParams,
  GetRecordResult,
  GetRecordSourceParams,
  GetRecordSourceResult,
  GetUserRecordSourceParams,
  GetUserRecordSourceResult,
  // UpdateRecordParams,
  UpdateRecordResult,
} from './record-service.types';
import { ChildEntity } from 'typeorm';

@Injectable()
export class RetweetService {
  constructor(
    private readonly recordsRepository: RecordRepository,
    private readonly fileStorageService: FileStorageService,
    private readonly wallService: WallService,
    private readonly wallPermissionService: WallPermissionService,
    private readonly recordsPermissionService: RecordPermissionService,
    private readonly eventEmmiter: EventEmitter2,
  ) {}

  async addRetweet(params: AddRetweetParams): Promise<AddRecordResult> {
    const { userId, recordId } = params;

    
    const parentRecord = await this.recordsRepository.findOne(
      { 
        where: { id: recordId }
       });

    const parents = await this.recordsRepository.findAncestors(parentRecord)

    const originalParentTweetId = parentRecord.isRetweet ? parents[parents.length-2] : parents[parents.length-1] 

    const newRecord = await this.recordsRepository.save({
      isComment: false,
      isRetweet: true,
      parentRecord: originalParentTweetId
    });

    this.eventEmmiter.emit('record.created', {
      data: newRecord,
      userId,
    });

    return { data: newRecord };
  }

  // async getRecordSource(
  //   params: GetRecordSourceParams,
  // ): Promise<GetRecordSourceResult> {
  //   const { recordId, userId } = params;

  //   const record = await this.getRecord({ recordId, userId });

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

  async getRecord(params: GetRecordParams): Promise<GetRecordResult> {
    const { userId, recordId } = params;

    const wall = await this.wallService.getByUserId({ userId });

    if (!wall.data) {
      throw new BadRequestException(`user with id <${userId}> not found`);
    }

    const record = await this.recordsRepository.findOne({
      where: {
        id: recordId,
      },
    });

    if (!record) {
      throw new BadRequestException(`record with id <${recordId}> not found`);
    }
    
    return {
      data: record,
    };
  }
  
  async GetAllUserRetweets(
    params: GetAllRetweetsParams,
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
        isComment: false,
        isRetweet: true,
        parentRecord: true 
        
      },
    });

    return {
      data: records,
    };
  }

  async getAllAccessedRecordsByUserId(
    params: GetAllAccessedRecordsByUserIdParams,
  ): Promise<GetAllAccessedRecordsByUserIdResult> {
    const { userId, fromUserId } = params;

    const wall = await this.wallService.getByUserId({
      userId: userId,
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

    const records = await this.recordsRepository.find({
      where: {
        wall: {
          id: wall.data.id,
        },
      },
    });

    if (userId === fromUserId) {
      return {
        data: records,
      };
    }

    const { records: accessedRecords } =
      await this.recordsPermissionService.getAccessedRecordsToUser({
        records,
        userId: fromUserId,
      });

    return {
      data: accessedRecords,
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
}
