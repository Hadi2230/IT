import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { WorklogsService } from './worklogs.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { Roles } from '../utils/roles.decorator';
import { RolesGuard } from '../utils/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('worklogs')
export class WorklogsController {
  constructor(private readonly worklogs: WorklogsService) {}

  @Post()
  @Roles('ADMIN', 'IT_AGENT')
  create(
    @Body()
    body: {
      date: string;
      itUserId: string;
      summary: string;
      hours: number;
      ticketId?: string;
    },
  ) {
    return this.worklogs.create(body);
  }

  @Get()
  @Roles('ADMIN', 'IT_AGENT')
  list(
    @Query()
    q: {
      itUserId?: string;
      ticketId?: string;
    },
  ) {
    return this.worklogs.list({ itUserId: q.itUserId, ticketId: q.ticketId });
  }
}
