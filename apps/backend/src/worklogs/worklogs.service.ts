import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WorklogsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    date: string;
    itUserId: string;
    summary: string;
    hours: number;
    ticketId?: string;
  }) {
    return this.prisma.workLog.create({
      data: {
        date: new Date(data.date),
        itUserId: data.itUserId,
        summary: data.summary,
        hours: data.hours,
        ticketId: data.ticketId ?? null,
      },
    });
  }

  list(filters: { itUserId?: string; ticketId?: string }) {
    return this.prisma.workLog.findMany({
      where: { itUserId: filters.itUserId, ticketId: filters.ticketId },
      orderBy: { date: 'desc' },
    });
  }
}
