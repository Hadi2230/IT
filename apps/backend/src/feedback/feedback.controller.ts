import { Body, Controller, Param, Post, Req, UseGuards } from '@nestjs/common';
import { FeedbackService } from './feedback.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { RolesGuard } from '../utils/roles.guard';
import type { AuthenticatedRequest } from '../utils/authenticated-request';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('tickets/:ticketId/feedback')
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  @Post()
  async create(
    @Param('ticketId') ticketId: string,
    @Req() req: AuthenticatedRequest,
    @Body() body: { rating: number; comment?: string },
  ) {
    return this.feedback.create({
      ticketId,
      givenById: req.user.userId,
      rating: body.rating,
      comment: body.comment,
    });
  }
}
