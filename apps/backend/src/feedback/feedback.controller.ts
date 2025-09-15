import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { CreateFeedbackDto } from './feedback.dtos';

@Controller('tickets/:ticketId/feedback')
export class FeedbackController {
  constructor(private readonly feedbackService: FeedbackService) {}

  @Get()
  async get(@Param('ticketId') ticketId: string) {
    return this.feedbackService.getByTicketId(ticketId);
  }

  @Post()
  async create(@Param('ticketId') ticketId: string, @Body() dto: CreateFeedbackDto) {
    return this.feedbackService.createForTicket(ticketId, dto);
  }
}

