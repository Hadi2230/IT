import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './messages.dtos';

@Controller('tickets/:ticketId/messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get()
  async list(@Param('ticketId') ticketId: string) {
    return this.messagesService.listMessages(ticketId);
  }

  @Post()
  async create(@Param('ticketId') ticketId: string, @Body() dto: CreateMessageDto) {
    return this.messagesService.createMessage(ticketId, dto);
  }
}

