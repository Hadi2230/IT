import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AssetsService {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    tag: string;
    type: string;
    model?: string;
    serialNumber?: string;
    status?: string;
    location?: string;
    notes?: string;
  }) {
    return this.prisma.asset.create({
      data: { ...data, status: data.status ?? 'in_stock' },
    });
  }

  list() {
    return this.prisma.asset.findMany({ orderBy: { createdAt: 'desc' } });
  }

  assign(assetId: string, userId: string) {
    return this.prisma.assetAssignment.create({ data: { assetId, userId } });
  }

  returnAsset(assignmentId: string) {
    return this.prisma.assetAssignment.update({
      where: { id: assignmentId },
      data: { returnedAt: new Date() },
    });
  }

  logService(
    assetId: string,
    data: {
      title: string;
      description: string;
      performedBy: string;
      cost?: number;
    },
  ) {
    return this.prisma.serviceLog.create({ data: { assetId, ...data } });
  }

  addLicense(
    assetId: string,
    data: {
      product: string;
      vendor?: string;
      licenseKey?: string;
      seatsTotal?: number;
      expiresAt?: Date;
    },
  ) {
    return this.prisma.softwareLicense.create({ data: { ...data, assetId } });
  }
}
