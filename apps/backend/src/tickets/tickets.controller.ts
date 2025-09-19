import { Body, Controller, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { Roles } from '../utils/roles.decorator';
import { RolesGuard } from '../utils/roles.guard';
import { AuditService } from '../audit/audit.service';
import type { AuthenticatedRequest } from '../utils/authenticated-request';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets')
export class TicketsController {
  constructor(
    private readonly tickets: TicketsService,
    private readonly audit: AuditService,
  ) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body()
    body: {
      title: string;
      description: string;
      category: string;
      priority?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    },
  ) {
    const ticket = await this.tickets.create({
      ...body,
      requesterId: req.user.userId,
    });
    await this.audit.log({
      actorId: req.user.userId,
      action: 'TICKET_CREATE',
      entity: 'Ticket',
      entityId: ticket.id,
    });
    return ticket;
  }

  @Get(':id')
  async get(@Param('id') id: string) {
    return this.tickets.findById(id);
  }

  @Get()
  async list(
    @Req() req: AuthenticatedRequest,
    @Query()
    q: {
      status?: string;
      priority?: string;
      assigneeId?: string;
      requesterId?: string;
      q?: string;
    },
  ) {
    // Employees see own tickets; IT/ADMIN can filter broadly
    const role = req.user.role;
    const filters = {
      status: q.status as
        | 'OPEN'
        | 'IN_PROGRESS'
        | 'PENDING_CUSTOMER'
        | 'RESOLVED'
        | 'CLOSED'
        | undefined,
      priority: q.priority as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | undefined,
      assigneeId: q.assigneeId,
      requesterId: role === 'EMPLOYEE' ? req.user.userId : q.requesterId,
      q: q.q,
    };
    return this.tickets.list(filters);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body()
    body: Partial<{
      title: string;
      description: string;
      category: string;
      priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
    }>,
  ) {
    return this.tickets.update(id, body);
  }

  @Patch(':id/status')
  @Roles('ADMIN', 'IT_AGENT')
  async changeStatus(
    @Param('id') id: string,
    @Body()
    body: {
      status:
        | 'OPEN'
        | 'IN_PROGRESS'
        | 'PENDING_CUSTOMER'
        | 'RESOLVED'
        | 'CLOSED';
    },
  ) {
    const t = await this.tickets.changeStatus(id, body.status);
    await this.audit.log({
      action: 'TICKET_STATUS',
      entity: 'Ticket',
      entityId: id,
      metadata: { status: body.status },
    });
    return t;
  }

  @Patch(':id/assign')
  @Roles('ADMIN', 'IT_AGENT')
  async assign(
    @Param('id') id: string,
    @Body() body: { assigneeId: string | null },
  ) {
    const t = await this.tickets.assign(id, body.assigneeId);
    await this.audit.log({
      action: 'TICKET_ASSIGN',
      entity: 'Ticket',
      entityId: id,
      metadata: { assigneeId: body.assigneeId },
    });
    return t;
  }
}
