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
import { RecordService } from '../repository/record.service';
import { AddRecordInput, UpdateRecordInput } from './inputs';

@ApiTags('Records')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('records')
export class CommentController {
  constructor(private recordService: RecordService) {}

  

  @Patch('/:recordId/change-access')
  async changeAccessToRecord(
    @Req() request: Request,
    @Param('recordId') recordId: string,
  ) {
    const { id } = request.user;

    await this.recordService.changeAccessPolicy({
      recordId: +recordId,
      userId: id,
    });
  }

  @Delete('/:recordId')
  async deleteRecord(
    @Req() request: Request,
    @Param('recordId') recordId: string,
  ) {
    const { id } = request.user;

    await this.recordService.deleteRecord({
      recordId: +recordId,
      userId: id,
    });
  }
}
