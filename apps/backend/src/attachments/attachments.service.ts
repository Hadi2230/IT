import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateAttachmentDto } from './attachments.dtos';

@Injectable()
export class AttachmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async listAttachments(ticketId: string) {
    return this.prisma.attachment.findMany({
      where: { ticketId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async createAttachmentForTicket(ticketId: string, dto: CreateAttachmentDto) {
    return this.prisma.attachment.create({
      data: {
        ticketId,
        filename: dto.filename,
        mimeType: dto.mimeType,
        sizeBytes: dto.sizeBytes,
        storageKey: dto.storageKey,
      },
    });
  }
}

