import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { TicketsService } from './tickets.service';
import { CreateTicketDto } from './tickets.dtos';

@Controller('tickets')
export class TicketsController {
  constructor(private readonly ticketsService: TicketsService) {}

  @Get()
  async list() {
    return this.ticketsService.listTickets();
  }

  @Get(':id')
  async getById(@Param('id') id: string) {
    return this.ticketsService.getTicketById(id);
  }

  @Post()
  async create(@Body() dto: CreateTicketDto) {
    return this.ticketsService.createTicket(dto);
  }
}

