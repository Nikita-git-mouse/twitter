import { Controller, Delete, Get, Param, UseGuards } from '@nestjs/common';
import { JwtPayload } from '../auth/core';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { AuthGuard } from '../auth/guards';
import { SessionService } from './session.service';

@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionController {
  constructor(private readonly sessionService: SessionService) {}

  @Get()
  getAllSessions(@CurrentUser() user: JwtPayload) {
    return this.sessionService.getAll(user.id);
  }

  @Delete('/:id')
  deleteSessionById(
    @CurrentUser() user: JwtPayload,
    @Param('id') sessionId: string,
  ) {
    return this.sessionService.deleteSessionById(user.id, sessionId);
  }

  @Delete()
  deleteAll(@CurrentUser() user: JwtPayload) {
    return this.sessionService.deleteAllSessions(user.id);
  }
}
