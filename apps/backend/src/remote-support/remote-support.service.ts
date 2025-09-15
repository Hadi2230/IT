import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { $Enums } from '@prisma/client';

function generateSessionCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
}

@Injectable()
export class RemoteSupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(ticketId: string, requesterId: string, dto: { expiresInMinutes?: number }) {
    const minutes = dto.expiresInMinutes ?? 60;
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    return this.prisma.remoteSession.create({
      data: {
        ticketId,
        requesterId,
        code: generateSessionCode(),
        expiresAt,
        status: $Enums.RemoteSessionStatus.PENDING,
      },
    });
  }

  async getById(id: string) {
    return this.prisma.remoteSession.findUnique({ where: { id } });
  }

  async getByCode(code: string) {
    return this.prisma.remoteSession.findUnique({ where: { code } });
  }

  async claimAsAgent(id: string, agentId: string) {
    return this.prisma.remoteSession.update({
      where: { id },
      data: { agentId, status: $Enums.RemoteSessionStatus.ACTIVE },
    });
  }

  async endSession(id: string) {
    return this.prisma.remoteSession.update({
      where: { id },
      data: { status: $Enums.RemoteSessionStatus.ENDED, endedAt: new Date() },
    });
  }
}

