import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ServiceLogsService } from './service-logs.service';
import { CreateServiceLogDto } from './service-logs.dtos';

@Controller('assets/:assetId/service-logs')
export class ServiceLogsController {
  constructor(private readonly serviceLogsService: ServiceLogsService) {}

  @Get()
  async list(@Param('assetId') assetId: string) {
    return this.serviceLogsService.listForAsset(assetId);
  }

  @Post()
  async create(@Param('assetId') assetId: string, @Body() dto: CreateServiceLogDto) {
    return this.serviceLogsService.createForAsset(assetId, dto);
  }
}

