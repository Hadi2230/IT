import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { RemoteService } from './remote.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { Roles } from '../utils/roles.decorator';
import { RolesGuard } from '../utils/roles.guard';
import type { AuthenticatedRequest } from '../utils/authenticated-request';
import { AccessService } from '../utils/access.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets/:ticketId/remote')
export class RemoteController {
  constructor(
    private readonly remote: RemoteService,
    private readonly access: AccessService,
  ) {}

  @Get()
  async list(
    @Req() req: AuthenticatedRequest,
    @Param('ticketId') ticketId: string,
  ) {
    await this.access.assertCanReadTicket(req.user, ticketId);
    return this.remote.list(ticketId);
  }

  @Post()
  @Roles('ADMIN', 'IT_AGENT')
  async create(
    @Req() req: AuthenticatedRequest,
    @Param('ticketId') ticketId: string,
    @Body() body: { link: string; note?: string },
  ) {
    await this.access.assertCanUpdateTicket(req.user, ticketId);
    return this.remote.create(ticketId, req.user.userId, body.link, body.note);
  }
}
