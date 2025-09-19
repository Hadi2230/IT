import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AssetsService } from './assets.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { Roles } from '../utils/roles.decorator';
import { RolesGuard } from '../utils/roles.guard';
import { AuditService } from '../audit/audit.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('assets')
export class AssetsController {
  constructor(
    private readonly assets: AssetsService,
    private readonly audit: AuditService,
  ) {}

  @Post()
  @Roles('ADMIN', 'IT_AGENT')
  create(
    @Body()
    body: {
      tag: string;
      type: string;
      model?: string;
      serialNumber?: string;
      status?: string;
      location?: string;
      notes?: string;
    },
  ) {
    return this.assets.create(body);
  }

  @Get()
  list() {
    return this.assets.list();
  }

  @Post(':id/assign')
  @Roles('ADMIN', 'IT_AGENT')
  assign(@Param('id') assetId: string, @Body() body: { userId: string }) {
    return this.assets.assign(assetId, body.userId);
  }

  @Patch('assignments/:assignmentId/return')
  @Roles('ADMIN', 'IT_AGENT')
  returnAsset(@Param('assignmentId') assignmentId: string) {
    return this.assets.returnAsset(assignmentId);
  }

  @Post(':id/service-logs')
  @Roles('ADMIN', 'IT_AGENT')
  logService(
    @Param('id') assetId: string,
    @Body()
    body: {
      title: string;
      description: string;
      performedBy: string;
      cost?: number;
    },
  ) {
    return this.assets.logService(assetId, body);
  }

  @Post(':id/licenses')
  @Roles('ADMIN', 'IT_AGENT')
  addLicense(
    @Param('id') assetId: string,
    @Body()
    body: {
      product: string;
      vendor?: string;
      licenseKey?: string;
      seatsTotal?: number;
      expiresAt?: string;
    },
  ) {
    const payload = {
      product: body.product,
      vendor: body.vendor,
      licenseKey: body.licenseKey,
      seatsTotal: body.seatsTotal,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : undefined,
    };
    return this.assets.addLicense(assetId, payload);
  }
}
