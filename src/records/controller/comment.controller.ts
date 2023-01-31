import {
<<<<<<< HEAD
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Put,
    Req,
    Res,
    UploadedFile,
    UseGuards,
    UseInterceptors,
  } from '@nestjs/common';
  import { TreeRepository } from 'typeorm';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
  import { request, Request, Response } from 'express';
  
  import { AuthGuard } from '../../auth/guards';
=======
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { AuthGuard } from '../../auth/guards';
>>>>>>> 2824b4d (sessions)
import { RecordEntity } from '../entity/record.entity';
import { CommentService } from '../repository/comment.service';
import { RecordRepository } from '../repository/record.repository';
<<<<<<< HEAD
  import { AddRecordInput, UpdateRecordInput } from './inputs';
import { InjectRepository } from '@nestjs/typeorm';
  
  @ApiTags('Records')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Controller('records')
  export class CommentController {
    constructor(private recordService: CommentService,
    @InjectRepository(RecordEntity)
    private readonly recordsRepository: TreeRepository<RecordEntity>) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('tweet'))
    @ApiConsumes('multipart/form-data')
    async addNewRecord(
      @Req() request: Request,
      @Body() input: AddRecordInput,
      @UploadedFile() file: Express.Multer.File,
    ) {
      const { id } = request.user;
  
      const { data } = await this.recordService.addRecord({
        ...input,
        file,
        userId: id,
      });
  
      return data;
    }
  
    @Get()
    async getAllRecords(@Req() request: Request) {
      const { id } = request.user;
  
      const { data } = await this.recordService.getAllUserRecords({ userId: id });
  
      return data;
    }
    // async findChildren(@Param('id') recordId: number): Promise<RecordEntity[]> {
    //     const record = await this.recordRepository.findOne({ id: recordId });
    //     return this.recordRepository.findDescendants(record);
    //   }
    @Get('/:tweetId')
    async findChildren(
    //   @Req() request: Request,
      @Param('tweetId') recordId: number): Promise<RecordEntity[]>
     {
        const record = await this.recordsRepository.findOne({
            where: {
                id: recordId,
              }, });
        return this.recordsRepository.findDescendants(record);
    }
    // @Get('/:tweetId')
    // async record(
    //   @Req() request: Request,
    //   @Param('tweetId') recordId: string,
    // ) {
    //   const { id } = request.user;
  
    //   const { data } = await this.recordService.getRecord({
    //     recordId: +recordId,
    //     userId: id,
    //   });
  
    //   return data;
    // }



  
    @Get('/users/:userId')
    async getAllAccessedRecordsByUserId(
      @Req() request: Request,
      @Param('userId') userId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.recordService.getAllAccessedRecordsByUserId({
        fromUserId: id,
        userId: +userId,
      });
  
      return data;
    }
  
    @Get('/users/:userId/:tweetId')
    async getRecordByUserId(
      @Req() request: Request,
      @Param('userId') userId: string,
      @Param('tweetId') recordId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.recordService.getByUserIdAndRecordId({
        fromUserId: id,
        recordId: +recordId,
        userId: +userId,
      });
  
      return data;
    }
  
    @Get('/users/:userId/:tweetId/source')
    async getUserRecordSource(
      @Req() request: Request,
      @Res() response: Response,
      @Param('userId') userId: string,
      @Param('tweetId') recordId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.recordService.getUserRecordSource({
        recordId: +recordId,
        fromUserId: id,
        userId: +userId,
      });
  
      return data.pipe(response);
    }
=======
import { AddRecordInput, UpdateRecordInput } from './inputs';

@ApiTags('Records')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('records')
export class RecordController {
  constructor(
    private recordService: CommentService,
    private readonly recordRepository: RecordRepository,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('tweet'))
  @ApiConsumes('multipart/form-data')
  async addNewRecord(
    @Req() request: Request,
    @Body() input: AddRecordInput,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { id } = request.user;

    const { data } = await this.recordService.addRecord({
      ...input,
      file,
      userId: id,
    });

    return data;
>>>>>>> 2824b4d (sessions)
  }

  @Get()
  async getAllRecords(@Req() request: Request) {
    const { id } = request.user;

    const { data } = await this.recordService.getAllUserRecords({ userId: id });

    return data;
  }
  // async findChildren(@Param('id') recordId: number): Promise<RecordEntity[]> {
  //     const record = await this.recordRepository.findOne({ id: recordId });
  //     return this.recordRepository.findDescendants(record);
  //   }
  @Get('/:tweetId')
  async findChildren(
    //   @Req() request: Request,
    @Param('tweetId') recordId: number,
  ): Promise<RecordEntity[]> {
    const record = await this.recordRepository.findOne({ id: recordId });
    return this.recordRepository.findDescendants(record);
  }

  @Get('/users/:userId')
  async getAllAccessedRecordsByUserId(
    @Req() request: Request,
    @Param('userId') userId: string,
  ) {
    const { id } = request.user;

    const { data } = await this.recordService.getAllAccessedRecordsByUserId({
      fromUserId: id,
      userId: +userId,
    });

    return data;
  }

  @Get('/users/:userId/:tweetId')
  async getRecordByUserId(
    @Req() request: Request,
    @Param('userId') userId: string,
    @Param('tweetId') recordId: string,
  ) {
    const { id } = request.user;

    const { data } = await this.recordService.getByUserIdAndRecordId({
      fromUserId: id,
      recordId: +recordId,
      userId: +userId,
    });

    return data;
  }

  @Get('/users/:userId/:tweetId/source')
  async getUserRecordSource(
    @Req() request: Request,
    @Res() response: Response,
    @Param('userId') userId: string,
    @Param('tweetId') recordId: string,
  ) {
    const { id } = request.user;

    const { data } = await this.recordService.getUserRecordSource({
      recordId: +recordId,
      fromUserId: id,
      userId: +userId,
    });

    return data.pipe(response);
  }
}
