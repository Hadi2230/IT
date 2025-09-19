import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(ticketId: string) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    return this.prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async create(params: {
    ticketId: string;
    authorId: string;
    content: string;
  }) {
    return this.prisma.message.create({
      data: {
        ticketId: params.ticketId,
        authorId: params.authorId,
        content: params.content,
      },
    });
  }
}
