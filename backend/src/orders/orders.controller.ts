import { Controller, Post, Body, Patch, Param, Get, NotFoundException, Req } from '@nestjs/common';
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
        customerId: body.customerId || null,
        totalAmount: total,
        items: { create: itemsData }
      }
    });
  }

  @Get()
  async findAll() {
    return this.prisma.order.findMany({ 
      include: { 
        items: { 
          include: { 
            product: { 
              include: { translations: { where: { locale: 'en' } } } 
            } 
          } 
        } 
      }, 
      orderBy: { createdAt: 'desc' } 
    });
  }

  @Patch(':id/approve')
  async approve(@Param('id') id: string, @Req() req: any) {
    const operatorId = req.headers['x-user-id'] || 'default-admin-id';
    const order = await this.prisma.order.update({ where: { id }, data: { status: 'APPROVED' } });
    
    if (operatorId !== 'default-admin-id') {
      await this.prisma.auditLog.create({
        data: { userId: operatorId, action: 'APPROVE_ORDER', targetId: id, details: `Approved order ${order.orderNumber}` }
      });
    }
    return order;
  }

  @Patch(':id/reject')
  async reject(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  @Patch(':id/ship')
  async ship(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'SHIPPED' } });
  }
}
