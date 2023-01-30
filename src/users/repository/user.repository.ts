import { EntityManager, Repository } from 'typeorm';
import { UserEntity } from '../entity/user.entity';
import { InjectEntityManager } from '@nestjs/typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends Repository<UserEntity> {
  constructor(@InjectEntityManager() entityManager: EntityManager) {
    super(UserEntity, entityManager);
  }
}
