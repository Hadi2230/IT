import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { RemoteSupportService } from './remote-support.service';
import { RemoteSupportController } from './remote-support.controller';
import { RemoteGateway } from './remote.gateway';

@Module({
  imports: [PrismaModule],
  controllers: [RemoteSupportController],
  providers: [RemoteSupportService, RemoteGateway],
})
export class RemoteSupportModule {}

