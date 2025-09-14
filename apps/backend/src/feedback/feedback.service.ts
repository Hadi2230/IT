import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeedbackDto } from './feedback.dtos';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async getByTicketId(ticketId: string) {
    return this.prisma.feedback.findUnique({
      where: { ticketId },
      include: { ticket: true, givenBy: true },
    });
  }

  async createForTicket(ticketId: string, dto: CreateFeedbackDto) {
    return this.prisma.feedback.create({
      data: {
        ticketId,
        rating: dto.rating,
        comment: dto.comment ?? null,
        givenById: dto.givenById,
      },
    });
  }
}

