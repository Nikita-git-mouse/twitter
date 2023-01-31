import { Module } from '@nestjs/common';
import { RecordController } from './controller';
import { RecordService } from './repository';
import { FileStorageService } from './filestorage';
import { RecordRepository } from './repository/record.repository';
import { WallModule } from '../records-wall/wall.module';
import { PermissionModule } from '../permissions';
import { CommentController } from './controller/comment.controller';
import { CommentService } from './repository/comment.service';
import { TweetController } from './controller/tweet.controller';
import { TweetService } from './repository/tweet.service';
import { RetweetService } from './repository/retweet.service';
import { RetweetController } from './controller/retweet.controller';

@Module({
  controllers: [RecordController, TweetController, RetweetController],
  providers: [RecordService, RecordRepository, FileStorageService, TweetService, RetweetService],
  imports: [WallModule, PermissionModule],
  exports: [RecordService, TweetService, RetweetService],
})
export class RecordModule {}
