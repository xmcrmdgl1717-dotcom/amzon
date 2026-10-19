import { Controller, Post, Body, Patch, Param, Get, NotFoundException, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('orders')
export class OrdersController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() body: any) {
    // 1. 强制校验登录状态
    if (!body.customerId) {
      throw new UnauthorizedException('Please login to place an order.');
    }

    // 2. 从数据库查出买家真实信息
    const customer = await this.prisma.customer.findUnique({
      where: { id: body.customerId }
    });
    if (!customer) throw new UnauthorizedException('Customer not found');

    return this.prisma.$transaction(async (tx) => {
      let total = 0;
      const itemsData = [];

      for (const item of body.items) {
        const p = await tx.product.findUnique({ where: { id: item.productId } });
        if (!p) throw new NotFoundException(`Product not found`);
        if (p.stock < item.quantity) throw new BadRequestException(`Insufficient stock for ${p.slug}`);
        
        total += p.basePrice * item.quantity;
        itemsData.push({ productId: p.id, quantity: item.quantity, unitPrice: p.basePrice });
        await tx.product.update({ where: { id: p.id }, data: { stock: { decrement: item.quantity } } });
      }
      
      let discountAmount = 0;
      if (body.couponCode) {
        const coupon = await tx.coupon.findUnique({ where: { code: body.couponCode.toUpperCase() } });
        if (coupon && coupon.isActive) {
           discountAmount = coupon.isPercentage ? total * coupon.discount : coupon.discount;
        }
      }

      const finalTotal = Math.max(0, total - discountAmount);

      // 3. 自动填入买家姓名、邮箱，地址如果没有默认值则使用占位
      return await tx.order.create({
        data: {
          orderNumber: 'ORD-' + Date.now(),
          customerId: customer.id,
          customerName: customer.name,
          customerEmail: customer.email,
          shippingAddr: customer.address || 'Default Address (Please update in profile)', // 假设 Customer 模型有 address 字段，若没有可先写死
          totalAmount: finalTotal,
          couponCode: body.couponCode || null,
          discountAmount: discountAmount,
          items: { create: itemsData }
        }
      });
    });
  }

  // ... 其他接口保持原样 ...
}
