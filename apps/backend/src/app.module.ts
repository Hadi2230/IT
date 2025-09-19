import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { TicketsModule } from './tickets/tickets.module';
import { MessagesModule } from './messages/messages.module';
import { AttachmentsModule } from './attachments/attachments.module';
import { AssetsModule } from './assets/assets.module';
import { WorklogsModule } from './worklogs/worklogs.module';
import { FeedbackModule } from './feedback/feedback.module';
import { AuditModule } from './audit/audit.module';
import { AccessModule } from './utils/access.module';
import { RealtimeModule } from './realtime/realtime.module';
import { ReportsModule } from './reports/reports.module';
import { RemoteModule } from './remote/remote.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`.env`, `.env.local`],
    }),
    ServeStaticModule.forRoot({
      rootPath: join(process.cwd(), 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false },
    }),
    PrismaModule,
    AuthModule,
    UsersModule,
    TicketsModule,
    MessagesModule,
    AttachmentsModule,
    AssetsModule,
    WorklogsModule,
    FeedbackModule,
    AuditModule,
    AccessModule,
    RealtimeModule,
    ReportsModule,
    RemoteModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
