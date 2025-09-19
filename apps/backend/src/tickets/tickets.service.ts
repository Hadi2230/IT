import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TicketsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    title: string;
    description: string;
    category: string;
    priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    requesterId: string;
  }) {
    return this.prisma.ticket.create({
      data: {
        title: params.title,
        description: params.description,
        category: params.category,
        priority: params.priority ?? 'MEDIUM',
        requesterId: params.requesterId,
      },
    });
  }

  async findById(id: string) {
    const t = await this.prisma.ticket.findUnique({
      where: { id },
      include: { requester: true, assignee: true },
    });
    if (!t) throw new NotFoundException('Ticket not found');
    return t;
  }

  async list(filters: {
    status?: 'OPEN' | 'IN_PROGRESS' | 'PENDING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
    priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    assigneeId?: string;
    requesterId?: string;
    q?: string;
  }) {
    const where: {
      status?: 'OPEN' | 'IN_PROGRESS' | 'PENDING_CUSTOMER' | 'RESOLVED' | 'CLOSED';
      priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      assigneeId?: string;
      requesterId?: string;
      OR?: Array<
        | { title: { contains: string; mode: 'insensitive' } }
        | { description: { contains: string; mode: 'insensitive' } }
      >;
    } = {};
    if (filters.status) where.status = filters.status;
    if (filters.priority) where.priority = filters.priority;
    if (filters.assigneeId) where.assigneeId = filters.assigneeId;
    if (filters.requesterId) where.requesterId = filters.requesterId;
    if (filters.q)
      where.OR = [
        { title: { contains: filters.q, mode: 'insensitive' } },
        { description: { contains: filters.q, mode: 'insensitive' } },
      ];
    return this.prisma.ticket.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(
    id: string,
    data: Partial<{
      title: string;
      description: string;
      category: string;
      priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    }>,
  ) {
    return this.prisma.ticket.update({ where: { id }, data });
  }

  async changeStatus(
    id: string,
    status: 'OPEN' | 'IN_PROGRESS' | 'PENDING_CUSTOMER' | 'RESOLVED' | 'CLOSED',
  ) {
    return this.prisma.ticket.update({ where: { id }, data: { status } });
  }

  async assign(id: string, assigneeId: string | null) {
    return this.prisma.ticket.update({ where: { id }, data: { assigneeId } });
  }
}
