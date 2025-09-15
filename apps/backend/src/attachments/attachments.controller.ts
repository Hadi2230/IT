import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { AttachmentsService } from './attachments.service';
import { CreateAttachmentDto } from './attachments.dtos';

@Controller('tickets/:ticketId/attachments')
export class AttachmentsController {
  constructor(private readonly attachmentsService: AttachmentsService) {}

  @Get()
  async list(@Param('ticketId') ticketId: string) {
    return this.attachmentsService.listAttachments(ticketId);
  }

  @Post()
  async create(@Param('ticketId') ticketId: string, @Body() dto: CreateAttachmentDto) {
    return this.attachmentsService.createAttachmentForTicket(ticketId, dto);
  }
}

