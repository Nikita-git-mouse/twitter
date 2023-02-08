import { Injectable } from "@nestjs/common";
import { InjectEntityManager } from "@nestjs/typeorm";
import { EntityManager, Repository } from "typeorm";
import { ImageEntity } from "../../entity/image.entity";

@Injectable()
export class ImageRepository extends Repository<ImageEntity> {
    constructor(@InjectEntityManager() entityManager: EntityManager) {
        super(ImageEntity, entityManager);
    }
}