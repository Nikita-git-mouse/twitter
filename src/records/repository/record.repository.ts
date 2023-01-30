import {EntityManager, Repository} from "typeorm";
import {RecordEntity} from "../entity/record.entity";
import {InjectEntityManager} from "@nestjs/typeorm";
import {Injectable} from "@nestjs/common";

@Injectable()
export class RecordRepository extends Repository<RecordEntity> {
    constructor(@InjectEntityManager() entityManager: EntityManager) {
        super(RecordEntity, entityManager);
    }
}