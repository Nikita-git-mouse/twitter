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
  import { TweetService } from '../repository/records/tweet.service';
  import { RecordService } from '../repository';
  import { AddRecordInput, UpdateRecordInput } from './inputs';
  
  @ApiTags('Tweet')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Controller('tweet')
  export class TweetController {
    constructor(
      private tweetService: TweetService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('record'))
    @ApiConsumes('multipart/form-data')
    async addNewRecord(
      @Req() request: Request,
      @Body() input: AddRecordInput,
      @UploadedFile() file: Express.Multer.File,
    ) {
      const { id } = request.user;
  
      const { data } = await this.tweetService.addTweet({
        ...input,
        file,
        userId: id,
      });
  
      return data;
    }
  
    @Get()
    async getAllRecords(@Req() request: Request) {
      const { id } = request.user;
  
      const { data } = await this.tweetService.getAllUserTweets({ userId: id });
  
      return data;
    }
  
    
    @Get('/users/:userId')
    async getAllAccessedRecordsByUserId(
      @Req() request: Request,
      @Param('userId') userId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.tweetService.getAllAccessedTweetsByUserId({
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
  
      const { data } = await this.tweetService.getByUserIdAndTweetId({
        fromUserId: id,
        recordId: +recordId,
        userId: +userId,
      });
  
      return data;
    }
  
    // @Get('/users/:userId/:tweetId/source')
    // async getUserRecordSource(
    //   @Req() request: Request,
    //   @Res() response: Response,
    //   @Param('userId') userId: string,
    //   @Param('tweetId') recordId: string,
    // ) {
    //   const { id } = request.user;
  
    //   const { data } = await this.tweetService.getUserTweetSource({
    //     recordId: +recordId,
    //     fromUserId: id,
    //     userId: +userId,
    //   });
  
    //   return data.pipe(response);
    // }

    @Get('/:tweetId')
    async getRecord(
      @Req() request: Request,
      @Param('tweetId') recordId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.tweetService.getTweet({
        recordId: +recordId,
        userId: id,
      });
  
      return data;
    }
  }
  

