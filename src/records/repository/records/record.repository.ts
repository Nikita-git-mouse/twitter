import {EntityManager, Repository, TreeRepository} from "typeorm";
import {RecordEntity} from "../../entity/record.entity";
import {InjectEntityManager} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class RecordRepository extends TreeRepository<RecordEntity> {
    constructor(@InjectEntityManager() entityManager: EntityManager) {
        super(RecordEntity, entityManager);
    }
}