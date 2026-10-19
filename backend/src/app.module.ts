import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { ProductsController } from './products/products.controller';
import { OrdersController } from './orders/orders.controller';
import { CustomersModule } from './customers/customers.module';
import { CategoriesModule } from './categories/categories.module';
import { AuditModule } from './audit/audit.module';
import { StaffModule } from './staff/staff.module';
import { BannersModule } from './banners/banners.module'; // 👈 引入
import { ReviewsModule } from './reviews/reviews.module'; // 👈 新增
import { CouponsModule } from './coupons/coupons.module'; // 👈 引入
@Module({
  imports: [
    JwtModule.register({ secret: 'SECRET_KEY', signOptions: { expiresIn: '7d' } }),
    CustomersModule,
    CategoriesModule,
    AuditModule,
    StaffModule,
    BannersModule // 👈 添加
    ReviewsModule // 👈 添加
     CouponsModule // 👈 添加
  ],
  controllers: [AuthController, ProductsController, OrdersController],
  providers: [PrismaService],
})
export class AppModule {}
