import { Body, Controller, Get, Param, Post, UseGuards, Req } from '@nestjs/common';
import { RemoteSupportService } from './remote-support.service';
import { CreateRemoteSessionDto, ConnectByCodeDto, ConnectTokenResponseDto, RemoteSocketRole } from './remote-support.dtos';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { JwtService } from '@nestjs/jwt';

@Controller()
export class RemoteSupportController {
  constructor(private readonly service: RemoteSupportService, private readonly jwt: JwtService) {}

  @UseGuards(JwtAuthGuard)
  @Post('tickets/:ticketId/remote-sessions')
  async create(@Param('ticketId') ticketId: string, @Body() dto: CreateRemoteSessionDto, @Req() req: any) {
    const auth = (req.headers?.authorization ?? '') as string;
    const requesterId = (this.jwt.decode(auth.split(' ')[1] ?? '') as any)?.sub as string;
    return this.service.createSession(ticketId, requesterId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('remote-sessions/:id')
  async get(@Param('id') id: string) {
    return this.service.getById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('remote-sessions/:id/claim')
  async claim(@Param('id') id: string, @Req() req: any): Promise<ConnectTokenResponseDto> {
    const auth = (req.headers?.authorization ?? '') as string;
    const agentId = (this.jwt.decode(auth.split(' ')[1] ?? '') as any)?.sub as string;
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

