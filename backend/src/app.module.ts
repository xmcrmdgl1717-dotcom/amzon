import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { ProductsController } from './products/products.controller';
import { OrdersController } from './orders/orders.controller';
import { CustomersModule } from './customers/customers.module';
import { CategoriesModule } from './categories/categories.module'; // 👈 检查路径拼写是否完全一致

@Module({
  imports: [
    JwtModule.register({ secret: 'SECRET_KEY', signOptions: { expiresIn: '7d' } }),
    CustomersModule,
    CategoriesModule // 👈 添加
  ],
  controllers: [AuthController, ProductsController, OrdersController],
  providers: [PrismaService],
})
export class AppModule {}
