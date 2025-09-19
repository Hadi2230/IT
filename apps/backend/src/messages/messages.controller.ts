import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { RolesGuard } from '../utils/roles.guard';
import { AuditService } from '../audit/audit.service';
import { AccessService } from '../utils/access.service';
import { ChatGateway } from '../realtime/chat.gateway';
import type { AuthenticatedRequest } from '../utils/authenticated-request';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets/:ticketId/messages')
export class MessagesController {
  constructor(
    private readonly messages: MessagesService,
    private readonly audit: AuditService,
    private readonly access: AccessService,
    private readonly chat: ChatGateway,
  ) {}

  @Get()
  async list(
    @Req() req: AuthenticatedRequest,
    @Param('ticketId') ticketId: string,
  ) {
    await this.access.assertCanReadTicket(req.user, ticketId);
    return this.messages.list(ticketId);
  }

  @Post()
  async create(
    @Param('ticketId') ticketId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { content: string },
  ) {
    await this.access.assertCanPostMessage(req.user, ticketId);
    const msg = await this.messages.create({
      ticketId,
      authorId: req.user.userId,
      content: body.content,
    });
    this.chat.notifyNewMessage(ticketId, msg);
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
