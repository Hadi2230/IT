import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AttachmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(params: {
    filename: string;
    mimeType: string;
    sizeBytes: number;
    storageKey: string;
    ticketId?: string;
    messageId?: string;
  }) {
    return this.prisma.attachment.create({
      data: {
        filename: params.filename,
        mimeType: params.mimeType,
        sizeBytes: params.sizeBytes,
        storageKey: params.storageKey,
        ticketId: params.ticketId ?? null,
        messageId: params.messageId ?? null,
      },
    });
  }
}
