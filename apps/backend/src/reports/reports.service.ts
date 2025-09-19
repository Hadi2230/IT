import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private readonly prisma: PrismaService) {}

  ticketsSummary() {
    return this.prisma.ticket.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
  }

  ticketsByPriority() {
    return this.prisma.ticket.groupBy({
      by: ['priority'],
      _count: { _all: true },
    });
  }
}
