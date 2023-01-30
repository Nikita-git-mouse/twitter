import {
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
  import { RetweetService } from '../repository/retweet.service';
  import { AddRecordInput, UpdateRecordInput } from './inputs';
  
  @ApiTags('Retweet')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Controller('retweet')
  export class RecordController {
    constructor(private recordService: RetweetService) {}
  
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
  
    @Get('/:tweetId')
    async getRecord(
      @Req() request: Request,
      @Param('tweetId') recordId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.recordService.getRecord({
        recordId: +recordId,
        userId: id,
      });
  
      return data;
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
  