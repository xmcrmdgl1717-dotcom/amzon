import { Controller, Get, Query, Post, Body, Delete, Param, NotFoundException } from '@nestjs/common';
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
      rating: p.rating,
      reviewCount: p.reviewCount,
      isPrime: p.isPrime,
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
        image: body.image, // 接收 Base64 字符串
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

  // 👇 新增：删除商品接口
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.delete({ where: { id } });
  }
}
