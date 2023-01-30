import { BadRequestException, Injectable } from '@nestjs/common';
import { WallRepository } from './wall.repository';

import {
  AssociateRecordWithWallParams,
  AssociateRecordWithWallResult,
  ChangeWallAccessParams,
  ChangeWallAccessResult,
  CreateWallParams,
  CreateWallResult,
  GetWallByUserIdParams,
  GetWallByUserIdResult,
} from './types/wall-service.types';

@Injectable()
export class WallService {
  constructor(private readonly wallRepository: WallRepository) {}

  async createWall(
    params: CreateWallParams,
  ): Promise<CreateWallResult> {
    const newWall = this.wallRepository.create({
      ...params,
      records: [],
    });

    const wall = await this.wallRepository.save(newWall);

    return {
      data: wall,
    };
  }

  async associateRecordWithWall(
    params: AssociateRecordWithWallParams,
  ): Promise<AssociateRecordWithWallResult> {
    const { record, userId } = params;

    const wall = await this.getByUserId({ userId });

    wall.data.records = wall.data.records
      ? [...wall.data.records, record]
      : [record];

    await this.wallRepository.save(wall.data);

    return;
  }

  async changeAccessPolicy(
    params: ChangeWallAccessParams,
  ): Promise<ChangeWallAccessResult> {
    const { userId } = params;

    const { data } = await this.getByUserId({ userId });

    if (data) {
      await this.wallRepository.update(
        { id: data.id },
        { access: !data.access },
      );
    } else {
      throw new BadRequestException('wall not found');
    }

    return undefined;
  }

  async getWallInfo(
    params: GetWallByUserIdParams,
  ): Promise<GetWallByUserIdResult> {
    const { userId } = params;

    const userWall = await this.wallRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
    });

    return { data: userWall };
  }

  async getByUserId(
    params: GetWallByUserIdParams,
  ): Promise<GetWallByUserIdResult> {
    const { userId } = params;

    const userWall = await this.wallRepository.findOne({
      where: {
        user: {
          id: userId,
        },
      },
      relations: {
        records: true,
        user: true,
      },
    });

    return { data: userWall };
  }
}
