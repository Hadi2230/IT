import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { WorklogsService } from './worklogs.service';
import { CreateWorklogDto } from './worklogs.dtos';

@Controller('tickets/:ticketId/worklogs')
export class WorklogsController {
  constructor(private readonly worklogsService: WorklogsService) {}

  @Get()
  async list(@Param('ticketId') ticketId: string) {
    return this.worklogsService.listWorklogs(ticketId);
  }

  @Post()
  async create(@Param('ticketId') ticketId: string, @Body() dto: CreateWorklogDto) {
    return this.worklogsService.createWorklog(ticketId, dto);
  }
}

