import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemoteService {
  constructor(private readonly prisma: PrismaService) {}

  create(ticketId: string, createdBy: string, link: string, note?: string) {
    return this.prisma.remoteSession.create({
      data: { ticketId, createdBy, link, note },
    });
  }

  list(ticketId: string) {
    return this.prisma.remoteSession.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'desc' },
    });
  }
}
