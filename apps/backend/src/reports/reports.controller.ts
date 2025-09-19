import { Controller, Get, UseGuards } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { Roles } from '../utils/roles.decorator';
import { RolesGuard } from '../utils/roles.guard';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('reports')
export class ReportsController {
  constructor(private readonly reports: ReportsService) {}

  @Get('tickets/status')
  ticketsByStatus() {
    return this.reports.ticketsSummary();
  }

  @Get('tickets/priority')
  ticketsByPriority() {
    return this.reports.ticketsByPriority();
  }
}
