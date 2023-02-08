import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { BanEntity } from '../entity/ban.entity';

@Injectable()
export class BanRepository extends Repository<BanEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(BanEntity, entityManager);
  }
}
