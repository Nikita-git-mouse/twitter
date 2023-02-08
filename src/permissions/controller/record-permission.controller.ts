import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthGuard } from '../../auth/guards';
import { RecordPermissionService } from '../repository';
import { UpdatePermissionInput, DeletePermissionInput } from './inputs';

@ApiTags('Record permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('permissions/records')
export class RecordPermissionController {
  constructor(
    private readonly recordPermissionService: RecordPermissionService,
  ) {}

  @Get()
  async getAllPermissions(@Req() request: Request) {
    const { id } = request.user;

    const { data } = await this.recordPermissionService.getAllByUserId({
      userId: id,
    });

    return data;
  }

  @Post('/:recordId')
  // @ApiConsumes('multipart/form-data')
  async addNewPermission(
    @Req() request: Request,
    @Param('recordId') recordId: string,
    @Body() input: UpdatePermissionInput,
  ) {
    const { id } = request.user;

    const { data } = await this.recordPermissionService.updatePermission({
      userId: id,
      ...input,
      recordId: +recordId,
    });

    return data;
  }

  @Delete('/:recordId')
  async deletePermission(
    @Req() request: Request,
    @Body() input: DeletePermissionInput,
    @Param() recordId: string,
  ) {
    const { id } = request.user;

    await this.recordPermissionService.deletePermission({
      userId: id,
      ...input,
      recordId: +recordId,
    });

    return;
  }
}
