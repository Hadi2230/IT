import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAssetDto } from './assets.dtos';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAssets() {
    return this.prisma.asset.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        assignments: true,
        serviceLogs: true,
        licenses: true,
      },
    });
  }

  async getAssetById(id: string) {
    return this.prisma.asset.findUnique({
      where: { id },
      include: {
        assignments: true,
        serviceLogs: true,
        licenses: true,
      },
    });
  }

  async createAsset(dto: CreateAssetDto) {
    return this.prisma.asset.create({
      data: {
        tag: dto.tag,
        type: dto.type,
        model: dto.model ?? null,
        serialNumber: dto.serialNumber ?? null,
        status: dto.status ?? undefined,
        location: dto.location ?? null,
        notes: dto.notes ?? null,
      },
    });
  }
}

