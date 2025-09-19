import { Body, Controller, Get, Param, Post, Req, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { RolesGuard } from '../utils/roles.guard';
import { AuditService } from '../audit/audit.service';
import type { AuthenticatedRequest } from '../utils/authenticated-request';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets/:ticketId/messages')
export class MessagesController {
  constructor(
    private readonly messages: MessagesService,
    private readonly audit: AuditService,
  ) {}

  @Get()
  async list(@Param('ticketId') ticketId: string) {
    return this.messages.list(ticketId);
  }

  @Post()
  async create(
    @Param('ticketId') ticketId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { content: string },
  ) {
    const msg = await this.messages.create({
      ticketId,
      authorId: req.user.userId,
      content: body.content,
    });
    await this.audit.log({
      actorId: req.user.userId,
      action: 'MESSAGE_CREATE',
      entity: 'Message',
      entityId: msg.id,
      metadata: { ticketId },
    });
    return msg;
  }
}
