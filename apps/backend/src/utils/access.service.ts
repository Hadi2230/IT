import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import type { AuthenticatedUserPayload } from './authenticated-request';

@Injectable()
export class AccessService {
  constructor(private readonly prisma: PrismaService) {}

  private isAdminOrAgent(user: AuthenticatedUserPayload): boolean {
    return user.role === 'ADMIN' || user.role === 'IT_AGENT';
  }

  async assertCanReadTicket(user: AuthenticatedUserPayload, ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (this.isAdminOrAgent(user) || ticket.requesterId === user.userId)
      return ticket;
    throw new ForbiddenException('Not allowed to access this ticket');
  }

  async assertCanUpdateTicket(
    user: AuthenticatedUserPayload,
    ticketId: string,
  ) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (this.isAdminOrAgent(user) || ticket.requesterId === user.userId)
      return ticket;
    throw new ForbiddenException('Not allowed to update this ticket');
  }

  async assertCanPostMessage(user: AuthenticatedUserPayload, ticketId: string) {
    return this.assertCanUpdateTicket(user, ticketId);
  }

  async assertCanUploadToTicket(
    user: AuthenticatedUserPayload,
    ticketId: string,
  ) {
    return this.assertCanUpdateTicket(user, ticketId);
  }

  async assertCanUploadToMessage(
    user: AuthenticatedUserPayload,
    messageId: string,
  ) {
    const message = await this.prisma.message.findUnique({
      where: { id: messageId },
      include: { ticket: true },
    });
    if (!message) throw new NotFoundException('Message not found');
    const ticket = message.ticket;
    if (this.isAdminOrAgent(user) || ticket.requesterId === user.userId)
      return message;
    throw new ForbiddenException('Not allowed to upload to this message');
  }
}
