import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class FeedbackService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    ticketId: string;
    givenById: string;
    rating: number;
    comment?: string;
  }) {
    const ticket = await this.prisma.ticket.findUnique({
      where: { id: params.ticketId },
    });
    if (!ticket) throw new NotFoundException('Ticket not found');
    if (ticket.requesterId !== params.givenById)
      throw new BadRequestException('Only requester can give feedback');
    return this.prisma.feedback.create({
      data: {
        ticketId: params.ticketId,
        givenById: params.givenById,
        rating: params.rating,
        comment: params.comment,
      },
    });
  }
}
