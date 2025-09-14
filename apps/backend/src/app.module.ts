import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AssetsModule } from './assets/assets.module';
import { FeedbackModule } from './feedback/feedback.module';
import { WorklogsModule } from './worklogs/worklogs.module';
import { AuditLogsModule } from './audit-logs/audit-logs.module';
import { ServiceLogsModule } from './service-logs/service-logs.module';
import { SoftwareLicensesModule } from './software-licenses/software-licenses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env`, `.env.local`] }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TicketsModule,
    MessagesModule,
    AttachmentsModule,
    AssetsModule,
    FeedbackModule,
    WorklogsModule,
    AuditLogsModule,
    ServiceLogsModule,
    SoftwareLicensesModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
