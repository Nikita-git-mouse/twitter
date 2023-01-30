import { EntityManager, Repository } from 'typeorm';
import { WallEntity } from '../entity/wall.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class WallRepository extends Repository<WallEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(WallEntity, entityManager);
  }
}
