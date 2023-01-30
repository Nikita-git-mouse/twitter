import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

import { AuthEntity } from '../entity/auth.entity';

@Injectable()
export class AuthRepository extends Repository<AuthEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(AuthEntity, entityManager);
  }
}
