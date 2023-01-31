import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { RefreshTokenEntity } from '../entity/refreshTokens.entity';

@Injectable()
export class RefreshTokensRepository extends Repository<RefreshTokenEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(RefreshTokenEntity, entityManager);
  }
}
