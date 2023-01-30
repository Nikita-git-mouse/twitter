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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
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
  async addNewPermission(
    @Req() request: Request,
    @Body() input: UpdatePermissionInput,
    @Param() recordId: string,
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
