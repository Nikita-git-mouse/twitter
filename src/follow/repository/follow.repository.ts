import { EntityManager, Repository } from 'typeorm';
import { FollowEntity } from '../entity/follow.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class FollowRepository extends Repository<FollowEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(FollowEntity, entityManager);
  }
}
