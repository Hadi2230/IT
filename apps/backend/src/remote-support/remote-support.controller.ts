import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { RemoteSupportService } from './remote-support.service';
import { CreateRemoteSessionDto, ConnectByCodeDto, ConnectTokenResponseDto, RemoteSocketRole } from './remote-support.dtos';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class RemoteSupportController {
  constructor(private readonly service: RemoteSupportService, private readonly jwt: JwtService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tickets/:ticketId/remote-sessions')
  async create(@Param('ticketId') ticketId: string, @Body() dto: CreateRemoteSessionDto) {
    // requesterId will be read from JWT subject later; for now accept from token
    const requesterId = (this.jwt.decode((this as any).request?.headers?.authorization?.split(' ')[1] ?? '') as any)?.sub;
    return this.service.createSession(ticketId, requesterId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('remote-sessions/:id')
  async get(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('remote-sessions/:id/claim')
  async claim(@Param('id') id: string): Promise<ConnectTokenResponseDto> {
    const agentId = (this.jwt.decode((this as any).request?.headers?.authorization?.split(' ')[1] ?? '') as any)?.sub;
    const session = await this.service.claimAsAgent(id, agentId);
    const expiresInSeconds = 60 * 10;
    const token = await this.jwt.signAsync({ sid: session.id, role: RemoteSocketRole.AGENT }, { expiresIn: expiresInSeconds });
    return { token, expiresInSeconds };
  }

  @Post('remote-sessions/code/:code/connect-token')
  async connectToken(@Param('code') code: string): Promise<ConnectTokenResponseDto> {
    const session = await this.service.getByCode(code);
    const expiresInSeconds = 60 * 10;
    const token = await this.jwt.signAsync({ sid: session?.id, role: RemoteSocketRole.REQUESTER }, { expiresIn: expiresInSeconds });
    return { token, expiresInSeconds };
  }

  @UseGuards(JwtAuthGuard)
  @Post('remote-sessions/:id/end')
  async end(@Param('id') id: string) {
    return this.service.endSession(id);
  }
}

import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RemoteSupportService } from './remote-support.service';
import { CreateRemoteSessionDto } from './remote-support.dtos';

@Controller('remote-sessions')
export class RemoteSupportController {
  constructor(private readonly service: RemoteSupportService) {}

  @Post()
  async create(@Body() dto: CreateRemoteSessionDto) {
    return this.service.createSession(dto.ticketId, dto.requesterId, dto.ttlMinutes ?? 60);
  }

  @Get(':code')
  async get(@Param('code') code: string) {
    return this.service.getByCode(code);
  }
}

