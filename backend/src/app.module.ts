import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { ProductsController } from './products/products.controller';
import { OrdersController } from './orders/orders.controller';

@Module({
  imports: [JwtModule.register({ secret: 'SECRET_KEY', signOptions: { expiresIn: '1d' } })],
  controllers: [AuthController, ProductsController, OrdersController],
  providers: [PrismaService],
})
export class AppModule {}
