import { Module } from '@nestjs/common';
import { ServiceLogsService } from './service-logs.service';
import { ServiceLogsController } from './service-logs.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [ServiceLogsController],
  providers: [ServiceLogsService],
})
export class ServiceLogsModule {}

