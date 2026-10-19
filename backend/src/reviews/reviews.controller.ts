import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('reviews')
export class ReviewsController {
  constructor(private prisma: PrismaService) {}

  // 获取某个商品的所有评论
  @Get('product/:productId')
  async findByProduct(@Param('productId') productId: string) {
    return this.prisma.review.findMany({
      where: { productId },
      include: { customer: { select: { name: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 获取所有评论（供后台使用）
  @Get()
  async findAll() {
    return this.prisma.review.findMany({
      include: { 
        customer: { select: { name: true, email: true } },
        product: { include: { translations: { where: { locale: 'en' } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
  }

  // 提交评论
  @Post()
  async create(@Body() body: any) {
    const review = await this.prisma.review.create({
      data: {
        rating: body.rating,
        content: body.content,
        productId: body.productId,
        customerId: body.customerId
      }
    });

    // 动态更新商品的平均分和评论数
    const allReviews = await this.prisma.review.findMany({ where: { productId: body.productId } });
    const avgRating = allReviews.reduce((acc, curr) => acc + curr.rating, 0) / allReviews.length;
    
    await this.prisma.product.update({
      where: { id: body.productId },
      data: { rating: avgRating, reviewCount: allReviews.length }
    });

    return review;
  }

  // 删除评论（后台管理）
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.review.delete({ where: { id } });
  }
}
