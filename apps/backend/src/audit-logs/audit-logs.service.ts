import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAuditLogDto } from './audit-logs.dtos';

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAuditLogs() {
    return this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { actor: true },
    });
  }

  async createAuditLog(dto: CreateAuditLogDto) {
    return this.prisma.auditLog.create({
      data: {
        actorId: dto.actorId ?? null,
        action: dto.action,
        entity: dto.entity,
        entityId: dto.entityId ?? null,
        metadata: dto.metadata ?? undefined,
      },
    });
  }
}

