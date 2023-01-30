import { EntityManager, Repository } from 'typeorm';
import { LikeEntity } from '../entity/likes.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class LikesRepository extends Repository<LikeEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(LikeEntity, entityManager);
  }
}
