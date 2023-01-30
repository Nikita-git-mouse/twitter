import { Controller, Get, Patch, Req, UseGuards } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { AuthGuard } from '../../auth/guards';
import { IRecord } from '../../records/entity/record.model';
import { IUser } from '../../users/entity/user.model';

import { WallService } from '../repository/wall.service';

@ApiTags('Wall')
@ApiBearerAuth()
@Controller('wall')
export class WallController {
  constructor(private wallService: WallService) {}

  @Patch('/change-access')
  @UseGuards(AuthGuard)
  async changeAccess(@Req() request: Request) {
    const { id } = request.user;

    return await this.wallService.changeAccessPolicy({ userId: id });
  }

  @Get()
  @UseGuards(AuthGuard)
  async getWallInfo(@Req() request: Request) {
    const { id } = request.user;

    const { data } = await this.wallService.getWallInfo({ userId: id });

    return data;
  }

  @OnEvent('user.created')
  async onUserCreated(payload: IUser) {
    await this.wallService.createWall({ user: payload });
  }

  @OnEvent('record.created')
  async onRecordCreated(payload: { data: IRecord; userId: number }) {
    const { data, userId } = payload;

    this.wallService.associateRecordWithWall({ record: data, userId });
  }
}
