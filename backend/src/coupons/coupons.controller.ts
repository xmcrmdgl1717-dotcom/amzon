import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('coupons')
export class CouponsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.coupon.findMany({ orderBy: { createdAt: 'desc' } });
  }

  @Post()
  async create(@Body() body: any) {
    return this.prisma.coupon.create({
      data: {
        code: body.code.toUpperCase(),
        discount: body.discount,
        isPercentage: body.isPercentage,
        minPurchase: body.minPurchase || 0,
        expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
      }
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.coupon.delete({ where: { id } });
  }

  // 前台结账时校验优惠券
  @Post('validate')
  async validate(@Body() body: { code: string; cartTotal: number }) {
    const coupon = await this.prisma.coupon.findUnique({ where: { code: body.code.toUpperCase() } });
    
    if (!coupon || !coupon.isActive) throw new Error('Invalid coupon code');
    if (coupon.expiresAt && new Date() > coupon.expiresAt) throw new Error('Coupon expired');
    if (body.cartTotal < coupon.minPurchase) throw new Error(`Minimum purchase of $${coupon.minPurchase} required`);

    let discountAmount = 0;
    if (coupon.isPercentage) {
      discountAmount = body.cartTotal * coupon.discount;
    } else {
      discountAmount = coupon.discount;
    }

    return { 
      valid: true, 
      discountAmount, 
      finalTotal: Math.max(0, body.cartTotal - discountAmount) 
    };
  }
}
