import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { ProductsController } from './products/products.controller';
import { OrdersController } from './orders/orders.controller';
import { CustomersModule } from './customers/customers.module'; // 👈 引入客户模块

@Module({
  imports: [
    JwtModule.register({ secret: 'SECRET_KEY', signOptions: { expiresIn: '7d' } }),
    CustomersModule // 👈 添加到 imports 数组中
  ],
  controllers: [
    AuthController, 
    ProductsController, 
    OrdersController
  ],
  providers: [PrismaService],
})
export class AppModule {}
