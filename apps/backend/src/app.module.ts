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
import { RemoteSupportModule } from './remote-support/remote-support.module';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'node:path';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, envFilePath: [`.env`, `.env.local`] }),
    PrismaModule,
    ServeStaticModule.forRoot({ rootPath: join(__dirname, '..', 'public') }),
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
    RemoteSupportModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
