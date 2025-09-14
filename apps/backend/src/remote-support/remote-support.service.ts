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

  async createSession(ticketId: string, requesterId: string, ttlMinutes = 60) {
    const code = generateSessionCode();
    const expiresAt = new Date(Date.now() + ttlMinutes * 60 * 1000);
    return this.prisma.remoteSession.create({
      data: {
        ticketId,
        requesterId,
        code,
        expiresAt,
      },
    });
  }

  async getByCode(code: string) {
    return this.prisma.remoteSession.findUnique({ where: { code } });
  }

  async activate(code: string, agentId: string) {
    return this.prisma.remoteSession.update({
      where: { code },
      data: { status: $Enums.RemoteSessionStatus.ACTIVE, agentId },
    });
  }

  async end(code: string) {
    return this.prisma.remoteSession.update({
      where: { code },
      data: { status: $Enums.RemoteSessionStatus.ENDED, endedAt: new Date() },
    });
  }
}

