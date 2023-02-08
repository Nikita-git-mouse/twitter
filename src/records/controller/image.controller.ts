import { Controller, UseGuards } from "@nestjs/common";
import { ApiBearerAuth, ApiTags } from "@nestjs/swagger";
import { AuthGuard } from "src/auth/guards/auth.guard";
import { ImageService } from "../repository/image/image.service";


// @ApiTags('Image')
// @ApiBearerAuth()
// @UseGuards(AuthGuard)
@Controller('comment')
export class ImageController {
constructor(private ImageService: ImageService) {}
}