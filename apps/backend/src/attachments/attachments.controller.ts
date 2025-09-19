import {
  Body,
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { AttachmentsService } from './attachments.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { RolesGuard } from '../utils/roles.guard';
import { AuditService } from '../audit/audit.service';
import { AccessService } from '../utils/access.service';
import type { AuthenticatedRequest } from '../utils/authenticated-request';

const uploadDir = 'uploads';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attachments')
export class AttachmentsController {
  constructor(
    private readonly attachments: AttachmentsService,
    private readonly audit: AuditService,
    private readonly access: AccessService,
  ) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: uploadDir,
        filename: (req, file, cb) => {
          const id = randomUUID().replace(/-/g, '');
          const ext = (file.originalname.split('.').pop() || '').toLowerCase();
          cb(null, `${id}${ext ? '.' + ext : ''}`);
        },
      }),
    }),
  )
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { ticketId?: string; messageId?: string },
    @Req() req: AuthenticatedRequest,
  ) {
    if (!body.ticketId && !body.messageId)
      throw new BadRequestException('ticketId or messageId is required');
    if (body.ticketId)
      await this.access.assertCanUploadToTicket(req.user, body.ticketId);
    if (body.messageId)
      await this.access.assertCanUploadToMessage(req.user, body.messageId);
    const att = await this.attachments.create({
      filename: file.originalname,
      mimeType: file.mimetype,
      sizeBytes: file.size,
      storageKey: file.filename,
      ticketId: body.ticketId,
      messageId: body.messageId,
    });
    await this.audit.log({
      action: 'ATTACHMENT_UPLOAD',
      entity: 'Attachment',
      entityId: att.id,
      metadata: { ticketId: body.ticketId, messageId: body.messageId },
    });
    return att;
  }
}
