import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaService } from './prisma/prisma.service';
import { AuthController } from './auth/auth.controller';
import { ProductsController } from './products/products.controller';
import { OrdersController } from './orders/orders.controller';
import { CustomersModule } from './customers/customers.module';
import { CategoriesModule } from './categories/categories.module';
import { AuditModule } from './audit/audit.module'; // 👈 引入
import { StaffModule } from './staff/staff.module'; // 👈 引入

@Module({
  imports: [
    JwtModule.register({ secret: 'SECRET_KEY', signOptions: { expiresIn: '7d' } }),
    CustomersModule,
    CategoriesModule,
    AuditModule,
    StaffModule
  ],
  controllers: [AuthController, ProductsController, OrdersController],
  providers: [PrismaService],
})
export class AppModule {}
