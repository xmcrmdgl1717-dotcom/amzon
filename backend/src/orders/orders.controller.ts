import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
@Controller('orders')
export class OrdersController {
  constructor(private prisma: PrismaService) {}
  
  @Post()
  async create(@Body() body: any) {
    let total = 0;
    const itemsData = [];
    for (const item of body.items) {
      const p = await this.prisma.product.findUnique({ where: { id: item.productId } });
      if (!p) throw new Error('Product not found');
      total += p.basePrice * item.quantity;
      itemsData.push({ productId: p.id, quantity: item.quantity, unitPrice: p.basePrice });
    }
    
    return this.prisma.order.create({
      data: {
        orderNumber: 'ORD-' + Date.now(),
        customerName: body.customerName,
        customerEmail: body.customerEmail,
        shippingAddr: body.shippingAddr,
        totalAmount: total,
        items: { create: itemsData }
      }
    });
  }

  @Get()
  async findAll() {
    return this.prisma.order.findMany({ include: { items: true }, orderBy: { createdAt: 'desc' } });
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'APPROVED' } });
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'REJECTED' } });
  }
}
import { Controller, Post, Body, Patch, Param, Get, NotFoundException } from '@nestjs/common';
// ... 原来的代码保持不变 ...

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { items: { include: { product: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    return order;
  }
