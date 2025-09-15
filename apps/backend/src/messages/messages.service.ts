import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMessageDto } from './messages.dtos';

@Injectable()
export class MessagesService {
  constructor(private readonly prisma: PrismaService) {}

  async listMessages(ticketId: string) {
    return this.prisma.message.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
      include: { author: true },
    });
  }

  async createMessage(ticketId: string, dto: CreateMessageDto) {
    return this.prisma.message.create({
      data: {
        ticketId,
        authorId: dto.authorId,
        content: dto.content,
      },
    });
  }
}

