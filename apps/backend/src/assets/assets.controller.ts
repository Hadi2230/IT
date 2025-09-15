import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AssetsService } from './assets.service';
import { CreateAssetDto } from './assets.dtos';

@Controller('assets')
export class AssetsController {
  constructor(private readonly assetsService: AssetsService) {}

  @Get()
  async list() {
    return this.assetsService.listAssets();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.assetsService.getAssetById(id);
  }

  @Post()
  async create(@Body() dto: CreateAssetDto) {
    return this.assetsService.createAsset(dto);
  }
}

