import { EntityManager, Repository } from 'typeorm';
import { WallPermissionEntity } from '../../entities';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IWallPermissionRepository } from '../../access';
import { IWallPermission } from '../../entities/models';

@Injectable()
export class WallPermissionRepository
  extends Repository<WallPermissionEntity>
  implements IWallPermissionRepository
{
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(WallPermissionEntity, entityManager);
  }
  async getByUserIdAndWallId(
    userId: number,
    wallId: number,
  ): Promise<IWallPermission | null> {
    const wallPermission = await this.findOne({
      where: {
        wall: {
          id: wallId,
        },
        specificUser: {
          id: userId,
        },
      },
    });

    return wallPermission;
  }
}
