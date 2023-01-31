import { EntityManager, Repository } from 'typeorm';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';
import { SessionEntity } from './session.entity';

@Injectable()
export class SessionRepository extends Repository<SessionEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(SessionEntity, entityManager);
  }
}
