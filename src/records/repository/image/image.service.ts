import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ImageEntity } from "../../entity/image.entity";
import { ImageRepository } from "./image.repository";

@Injectable()

export class ImageService {
constructor(
    private readonly ImageRepository: ImageRepository
){}
}