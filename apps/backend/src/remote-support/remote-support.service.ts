import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRemoteSessionDto } from './remote-support.dtos';

function generateJoinCode(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let out = '';
  for (let i = 0; i < 6; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}

@Injectable()
export class RemoteSupportService {
  constructor(private readonly prisma: PrismaService) {}

  async createSession(ticketId: string, requesterId: string, dto: CreateRemoteSessionDto) {
    const minutes = dto.expiresInMinutes ?? 60;
    const expiresAt = new Date(Date.now() + minutes * 60 * 1000);
    return this.prisma.remoteSession.create({
      data: {
        ticketId,
        requesterId,
        code: generateJoinCode(),
        expiresAt,
        status: 'PENDING' as any,
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
      data: { agentId, status: 'ACTIVE' as any },
    });
  }

  async endSession(id: string) {
    return this.prisma.remoteSession.update({
      where: { id },
      data: { status: 'ENDED' as any, endedAt: new Date() },
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

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
      data: { status: 'ACTIVE', agentId },
    });
  }

  async end(code: string) {
    return this.prisma.remoteSession.update({
      where: { code },
      data: { status: 'ENDED', endedAt: new Date() },
    });
  }
}

