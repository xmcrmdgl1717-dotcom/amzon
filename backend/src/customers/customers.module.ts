import { Module } from '@nestjs/common';
import { CustomersController } from './customers.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [JwtModule.register({ secret: 'SECRET_KEY', signOptions: { expiresIn: '7d' } })],
  controllers: [CustomersController],
  providers: [PrismaService],
})
export class CustomersModule {}
