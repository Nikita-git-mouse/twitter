import { EntityManager, In, Repository } from 'typeorm';
import { RecordPermissionEntity } from '../../entities';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { IRecordPermission } from '../../entities/models'
import { IRecordPermissionRepository } from '../../access';

@Injectable()
export class RecordPermissionRepository
  extends Repository<RecordPermissionEntity>
  implements IRecordPermissionRepository
{
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(RecordPermissionEntity, entityManager);
  }

  async getByUserIdAndRecordId(
    userId: number,
    recordId: number,
  ): Promise<IRecordPermission> {
    const record = await this.findOne({
      where: {
        specificUser: {
          id: userId,
        },
        record: {
          id: recordId,
        },
      },
    });

    return record;
  }

  async getByUserIdAndRecordsId(
    userId: number,
    recordsIds: number[],
  ): Promise<IRecordPermission[]> {
    const records = await this.find({
      where: {
        id: In(recordsIds),
        specificUser: {
          id: userId,
        },
      },
    });

    return records;
  }
}
