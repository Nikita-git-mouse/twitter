import { Module } from '@nestjs/common';
import { RecordController } from './controller';
import { RecordService } from './repository';
import { FileStorageService } from './filestorage';
import { RecordRepository } from './repository/records/record.repository';
import { WallModule } from '../records-wall/wall.module';
import { PermissionModule } from '../permissions';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './repository/records/comment.service';
import { TweetController } from './controller/tweet.controller';
import { TweetService } from './repository/records/tweet.service';
import { RetweetService } from './repository/records/retweet.service';
import { RetweetController } from './controller/retweet.controller';
import { ImageRepository } from './repository/image/image.repository';
import { ImageService } from './repository/image/image.service';
import { ImageController } from './controller/image.controller';

@Module({
  controllers: [TweetController, RetweetController, RecordController,CommentController,ImageController],
  providers: [ImageRepository,RecordRepository, FileStorageService, TweetService,RetweetService, RecordService,CommentService, ImageService],
  imports: [WallModule, PermissionModule],
  exports: [TweetService, RetweetService, RecordService, CommentService, ImageService],
})
export class RecordModule {}
