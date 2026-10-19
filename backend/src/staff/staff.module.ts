import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [StaffController],
  providers: [PrismaService],
})
export class StaffModule {}
