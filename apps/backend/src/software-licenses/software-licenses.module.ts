import { Module } from '@nestjs/common';
import { SoftwareLicensesService } from './software-licenses.service';
import { SoftwareLicensesController } from './software-licenses.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [SoftwareLicensesController],
  providers: [SoftwareLicensesService],
})
export class SoftwareLicensesModule {}

