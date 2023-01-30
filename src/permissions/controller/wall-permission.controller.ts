import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthGuard } from '../../auth/guards';
import { WallPermissionService } from '../repository';
import { DeletePermissionInput, UpdatePermissionInput } from './inputs';

@ApiTags('Wall permissions')
@ApiBearerAuth()
@UseGuards(AuthGuard)
@Controller('permissions/wall')
export class WallPermissionController {
  constructor(
    private readonly wallPermissionService: WallPermissionService,
  ) {}

  @Get()
  async getAllPermissions(@Req() request: Request) {
    const { id } = request.user;

    const { data } = await this.wallPermissionService.getAllByUserId({
      userId: id,
    });

    return data;
  }

  @Post()
  async addNewPermission(
    @Req() request: Request,
    @Body() input: UpdatePermissionInput,
  ) {
    const { id } = request.user;

    const { data } = await this.wallPermissionService.updatePermission({
      userId: id,
      ...input,
    });

    return data;
  }

  @Delete()
  async deletePermission(
    @Req() request: Request,
    @Body() input: DeletePermissionInput,
  ) {
    const { id } = request.user;

    await this.wallPermissionService.deletePermission({
      userId: id,
      ...input,
    });

    return;
  }
}
