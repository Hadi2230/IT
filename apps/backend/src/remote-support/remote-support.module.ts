import { Module } from '@nestjs/common';
import { RemoteSupportService } from './remote-support.service';
import { RemoteSupportController } from './remote-support.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RemoteSupportGateway } from './remote-support.gateway';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    PrismaModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: process.env.JWT_SECRET || 'change_me',
        signOptions: { expiresIn: '10m' },
      }),
    }),
  ],
  controllers: [RemoteSupportController],
  providers: [RemoteSupportService, RemoteSupportGateway],
})
export class RemoteSupportModule {}

