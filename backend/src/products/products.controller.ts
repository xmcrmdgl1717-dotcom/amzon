import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Query('locale') locale: string = 'en') {
    const products = await this.prisma.product.findMany({
      include: { translations: { where: { locale } } }
    });
    
    return products.map(p => ({
      id: p.id,
      slug: p.slug,
      price: p.basePrice,
      image: p.image,
      stock: p.stock,
      rating: p.rating,           // 👈 返回评分
      reviewCount: p.reviewCount, // 👈 返回评论数
      isPrime: p.isPrime,         // 👈 返回 Prime
      title: p.translations[0]?.title || p.slug,
      description: p.translations[0]?.description || ''
    }));
  }

  @Post()
  async create(@Body() body: any) {
    return this.prisma.product.create({
      data: {
        slug: body.slug || `product-${Date.now()}`,
        basePrice: body.price,
        image: body.image || 'https://via.placeholder.com/150',
        stock: body.stock || 100,
        rating: 5.0,
        reviewCount: 0,
        isPrime: true,
        translations: {
          create: [{ locale: 'en', title: body.title, description: body.description || '' }]
        }
      }
    });
  }
}
