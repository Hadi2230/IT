import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSoftwareLicenseDto, ListLicensesQueryDto } from './software-licenses.dtos';

@Injectable()
export class SoftwareLicensesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListLicensesQueryDto) {
    return this.prisma.softwareLicense.findMany({
      where: {
        product: query.product ? { contains: query.product } : undefined,
        vendor: query.vendor ? { contains: query.vendor } : undefined,
      },
      orderBy: { createdAt: 'desc' },
      include: { asset: true },
    });
  }

  async listByAsset(assetId: string) {
    return this.prisma.softwareLicense.findMany({
      where: { assetId },
      orderBy: { createdAt: 'desc' },
      include: { asset: true },
    });
  }

  async create(dto: CreateSoftwareLicenseDto) {
    return this.prisma.softwareLicense.create({
      data: {
        product: dto.product,
        vendor: dto.vendor ?? null,
        licenseKey: dto.licenseKey ?? null,
        seatsTotal: dto.seatsTotal ?? null,
        seatsUsed: dto.seatsUsed ?? undefined,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
        assetId: dto.assetId ?? null,
      },
    });
  }
}

