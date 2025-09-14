import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateServiceLogDto } from './service-logs.dtos';

@Injectable()
export class ServiceLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async listForAsset(assetId: string) {
    return this.prisma.serviceLog.findMany({
      where: { assetId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createForAsset(assetId: string, dto: CreateServiceLogDto) {
    return this.prisma.serviceLog.create({
      data: {
        assetId,
        title: dto.title,
        description: dto.description,
        performedBy: dto.performedBy,
        cost: dto.cost ?? null,
      },
    });
  }
}

