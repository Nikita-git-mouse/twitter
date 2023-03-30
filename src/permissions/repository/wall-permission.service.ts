import { BadRequestException, Injectable } from '@nestjs/common';
import { WallService } from '../../records-wall/repository/wall.service';
import { WallPermissionDomain } from '../access';

import { WallPermissionRepository } from './repositories';
import {
  CheckUserPermissionToWallParams,
  CheckUserPermissionToWallResult,
  DeletePermissionParams,
  DeletePermissionResult,
  GetAllByUserIdParams,
  GetAllByUserIdResult,
  UpdatePermissionParams,
  UpdatePermissionResult,
} from './types';

@Injectable()
export class WallPermissionService {
  constructor(
    private readonly wallService: WallService,
    private readonly wallPermissionRepository: WallPermissionRepository,
    private readonly wallPermissionDomain: WallPermissionDomain,
  ) {}

  async getAllByUserId(
    params: GetAllByUserIdParams,
  ): Promise<GetAllByUserIdResult> {
    const { userId } = params;

    const wall = await this.wallService.getByUserId({ userId });

    const permissions = await this.wallPermissionRepository.find({
      where: {
        wall: {
          id: wall.data.id,
        },
      },
    });

    return {
      data: permissions,
    };
  }

  async deletePermission(
    params: DeletePermissionParams,
  ): Promise<DeletePermissionResult> {
    const { userId, specificUserId } = params;

    const wall = await this.wallService.getByUserId({ userId });

    const permission = await this.wallPermissionRepository.findOne({
      where: {
        wall: {
          id: wall.data.id,
        },
        specificUser: {
          id: specificUserId,
        },
      },
    });

    if (!permission) {
      throw new BadRequestException(`record or user with their id not found`);
    }

    await this.wallPermissionRepository.delete({ id: permission.id });

    return;
  }

  async updatePermission(
    params: UpdatePermissionParams,
  ): Promise<UpdatePermissionResult> {
    const { userId, specificUserId, access } = params;

    const wall = await this.wallService.getByUserId({ userId });

    const permission = await this.wallPermissionRepository.findOne({
      where: {
        wall: {
          id: wall.data.id,
        },
        specificUser: {
          id: specificUserId,
        },
      },
    });

    let raw: any;
    if (permission) {
      const data = await this.wallPermissionRepository.update(
        { id: permission.id },
        {
          access: access,
        },
      );

      raw = data.raw;
    } else {
      const newPermission = await this.wallPermissionRepository.save({
        //id: permission.id,
        access,
        wall: wall.data,
        specificUser: {
          id: specificUserId,
        },
      });

      raw = newPermission;
    }

    return { data: raw };
  }

  async checkUserPermissionToWall(
    params: CheckUserPermissionToWallParams,
  ): Promise<CheckUserPermissionToWallResult> {
    const { userId, wall } = params;

    return this.wallPermissionDomain.checkAccessToWall({
      wall,
      userId,
    });
  }
}
