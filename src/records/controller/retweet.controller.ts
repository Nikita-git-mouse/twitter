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
  import { AddRecordInput, AddRetweetInput, UpdateRecordInput } from './inputs';
  
  @ApiTags('Retweet')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Controller('retweet')
  export class RetweetController {
    constructor(private retweetService: RetweetService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('retweet'))
    @ApiConsumes('multipart/form-data')
    async addRetweet(
      @Req() request: Request,
      @Body() input: AddRetweetInput,
      @UploadedFile() file: Express.Multer.File,
    ) {
      const { id } = request.user;
  
      const { data } = await this.retweetService.addRetweet({
        ...input,
        file,
        userId: id,
        access: true,
        recordId: undefined
      });
  
      return data;
    }
  
    @Get()
    async getAllRecords(@Req() request: Request) {
      const { id } = request.user;
  
      const { data } = await this.retweetService.GetAllUserRetweets({ userId: id });
  
      return data;
    }
  
    @Get('/:retweetId')
    async getRecord(
      @Req() request: Request,
      @Param('tweetId') recordId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.retweetService.getRecord({
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
  
      const { data } = await this.retweetService.getAllAccessedRecordsByUserId({
        fromUserId: id,
        userId: +userId,
      });
  
      return data;
    }
  
    @Get('/users/:userId/:retweetId')
    async getRecordByUserId(
      @Req() request: Request,
      @Param('userId') userId: string,
      @Param('tweetId') recordId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.retweetService.getByUserIdAndRecordId({
        fromUserId: id,
        recordId: +recordId,
        userId: +userId,
      });
  
      return data;
    }
  
    @Get('/users/:userId/:retweetId/source')
    async getUserRecordSource(
      @Req() request: Request,
      @Res() response: Response,
      @Param('userId') userId: string,
      @Param('retweetId') recordId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.retweetService.getUserRecordSource({
        recordId: +recordId,
        fromUserId: id,
        userId: +userId,
      });
  
      return data.pipe(response);
    }
  }
  