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

      // 1. 校验库存并计算总价
      for (const item of body.items) {
        const p = await tx.product.findUnique({ where: { id: item.productId } });
        if (!p) throw new NotFoundException(`Product not found`);
        if (p.stock < item.quantity) {
          throw new BadRequestException(`Insufficient stock for ${p.slug}. Only ${p.stock} left.`);
        }
        
        total += p.basePrice * item.quantity;
        itemsData.push({ productId: p.id, quantity: item.quantity, unitPrice: p.basePrice });
        
        // 2. 扣减库存
        await tx.product.update({
          where: { id: p.id },
          data: { stock: { decrement: item.quantity } }
        });
      }
      
      // 3. 创建订单
      const order = await tx.order.create({
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

      return order;
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
    // 驳回订单时应该把库存加回去（可选实现，暂略）
    return this.prisma.order.update({ where: { id }, data: { status: 'REJECTED' } });
  }

  @Patch(':id/ship')
  async ship(@Param('id') id: string) {
    return this.prisma.order.update({ where: { id }, data: { status: 'SHIPPED' } });
  }
}
