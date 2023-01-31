import { Module } from '@nestjs/common';
import { SessionRepository } from './session.repository';
import { SessionService } from './session.service';
import { SessionController } from './sessions.controller';

@Module({
  controllers: [SessionController],
  providers: [SessionService, SessionRepository],
  exports: [SessionService],
})
export class SessionModule {}
