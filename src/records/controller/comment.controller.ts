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
import { CommentService } from '../repository/records/comment.service';
import { AuthGuard } from '../../auth/guards';
import { RecordService } from '../repository/records/record.service';
import { AddRecordInput, AddRetweetInput, UpdateRecordInput } from './inputs';

  @ApiTags('Comment')
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Controller('comment')
  export class CommentController {
    constructor(private commentService: CommentService) {}
  
    @Post()
    @UseInterceptors(FileInterceptor('record'))
    @ApiConsumes('multipart/form-data')
    async addComment(
      @Req() request: Request,
      @Body() input: AddRetweetInput,
      @UploadedFile() file: Express.Multer.File,
    ) {
      const { id } = request.user;
      
      const { data } = await this.commentService.addComment({
        ...input,
        file,
        userId: id,
      });
  
      return data;
    }
  
    @Get('/:recordId')
    async getRecord(
      @Req() request: Request,
      @Param('tweetId') recordId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.commentService.getComment({
        recordId: +recordId,
        userId: id,
      });
  
      return data;
    }
  
    @Get('/users/:userId/:commentId')
    async getRecordByUserId(
      @Req() request: Request,
      @Param('userId') userId: string,
      @Param('tweetId') recordId: string,
    ) {
      const { id } = request.user;
  
      const { data } = await this.commentService.getByUserIdAndRecordId({
        fromUserId: id,
        recordId: +recordId,
        userId: +userId,
      });
  
      return data;
    }
  
  //   @Get('/users/:userId/:commentId/source')
  //   async getUserRecordSource(
  //     @Req() request: Request,
  //     @Res() response: Response,
  //     @Param('userId') userId: string,
  //     @Param('retweetId') recordId: string,
  //   ) {
  //     const { id } = request.user;
  
  //     const { data } = await this.commentService.getUserRecordSource({
  //       recordId: +recordId,
  //       fromUserId: id,
  //       userId: +userId,
  //     });
  
  //     return data.pipe(response);
  //   }
  // }
  }