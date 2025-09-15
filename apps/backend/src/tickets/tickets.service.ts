import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTicketDto } from './tickets.dtos';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async listTickets() {
    return this.prisma.ticket.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        requester: true,
        assignee: true,
      },
    });
  }

  async getTicketById(id: string) {
    return this.prisma.ticket.findUnique({
      where: { id },
      include: {
        requester: true,
        assignee: true,
        messages: true,
        attachments: true,
        workLogs: true,
        feedback: true,
      },
    });
  }

  async createTicket(dto: CreateTicketDto) {
    return this.prisma.ticket.create({
      data: {
        title: dto.title,
        description: dto.description,
        category: dto.category,
        priority: dto.priority,
        requesterId: dto.requesterId,
        assigneeId: dto.assigneeId ?? null,
      },
    });
  }
}

