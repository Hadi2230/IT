import {
  Controller,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  Body,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { randomUUID } from 'crypto';
import { AttachmentsService } from './attachments.service';
import { JwtAuthGuard } from '../utils/jwt-auth.guard';
import { RolesGuard } from '../utils/roles.guard';
import { AuditService } from '../audit/audit.service';

const uploadDir = 'uploads';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('attachments')
export class AttachmentsController {
  constructor(
    private readonly attachments: AttachmentsService,
    private readonly audit: AuditService,
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
  ) {
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
