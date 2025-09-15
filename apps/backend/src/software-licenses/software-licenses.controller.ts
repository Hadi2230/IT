import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { SoftwareLicensesService } from './software-licenses.service';
import { CreateSoftwareLicenseDto, ListLicensesQueryDto } from './software-licenses.dtos';

@Controller('licenses')
export class SoftwareLicensesController {
  constructor(private readonly licensesService: SoftwareLicensesService) {}

  @Get()
  async list(@Query() query: ListLicensesQueryDto) {
    return this.licensesService.list(query);
  }

  @Get('asset/:assetId')
  async listByAsset(@Param('assetId') assetId: string) {
    return this.licensesService.listByAsset(assetId);
  }

  @Post()
  async create(@Body() dto: CreateSoftwareLicenseDto) {
    return this.licensesService.create(dto);
  }
}

