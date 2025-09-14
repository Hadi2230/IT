import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorklogDto } from './worklogs.dtos';

@Injectable()
export class WorklogsService {
  constructor(private readonly prisma: PrismaService) {}

  async listWorklogs(ticketId: string) {
    return this.prisma.workLog.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
      include: { itUser: true },
    });
  }

  async createWorklog(ticketId: string, dto: CreateWorklogDto) {
    return this.prisma.workLog.create({
      data: {
        ticketId,
        date: dto.date,
        itUserId: dto.itUserId,
        summary: dto.summary,
        hours: dto.hours ?? 0,
      },
    });
  }
}

