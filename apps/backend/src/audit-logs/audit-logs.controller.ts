import { Body, Controller, Get, Post } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { CreateAuditLogDto } from './audit-logs.dtos';

@Controller('audit-logs')
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  async list() {
    return this.auditLogsService.listAuditLogs();
  }

  @Post()
  async create(@Body() dto: CreateAuditLogDto) {
    return this.auditLogsService.createAuditLog(dto);
  }
}

