import { Inject } from '@nestjs/common';

import { WallPermissionRepository } from '../repository/repositories';
import {
  CheckAccessToWallParams,
  CheckAccessToWallResult,
} from './types';

import { IWallPermissionRepository } from './interfaces';

export class WallPermissionDomain {
  constructor(
    @Inject(WallPermissionRepository)
    private readonly wallPermissionStore: IWallPermissionRepository,
  ) {}

  async checkAccessToWall(
    params: CheckAccessToWallParams,
  ): Promise<CheckAccessToWallResult> {
    const { wall, userId } = params;

    const wallPermission =
      await this.wallPermissionStore.getByUserIdAndWallId(
        userId,
        wall.id,
      );

    if (wallPermission) {
      return wallPermission.access;
    }

    return wall.access;
  }
}
