import { Controller, Post, Body, Patch, Param, Get, NotFoundException, BadRequestException, Req } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('orders')
export class OrdersController {
  constructor(private prisma: PrismaService) {}

  @Post()
  async create(@Body() body: any) {
    return this.prisma.$transaction(async (tx) => {
      let total = 0;
      const itemsData = [];

      for (const item of body.items) {
        const p = await tx.product.findUnique({ where: { id: item.productId } });
        if (!p) throw new NotFoundException(`Product not found`);
        if (p.stock < item.quantity) throw new BadRequestException(`Insufficient stock`);
        
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

      return await tx.order.create({
        data: {
          orderNumber: 'ORD-' + Date.now(),
          customerName: body.customerName,
          customerEmail: body.customerEmail,
          shippingAddr: body.shippingAddr,
          customerId: body.customerId || null,
          totalAmount: finalTotal,
          couponCode: body.couponCode || null,
          discountAmount: discountAmount,
          items: { create: itemsData }
        }
      });
    });
  }

  @Get()
  async findAll() {
    return this.prisma.order.findMany({ 
      include: { items: { include: { product: { include: { translations: { where: { locale: 'en' } } } } } } }, 
      orderBy: { createdAt: 'desc' } 
    });
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'APPROVED' } });
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  // 👈 修改：接收并保存物流单号
  @Patch(':id/ship')
  async ship(@Param('id') id: string, @Body() body: { trackingNumber: string }) {
    return this.prisma.order.update({ 
      where: { id }, 
      data: { 
        status: 'SHIPPED',
        trackingNumber: body.trackingNumber 
      } 
    });
  }
}
