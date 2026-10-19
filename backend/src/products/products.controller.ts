import { Controller, Get, Query, Post, Body, Delete, Patch, Param, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll(@Query('locale') locale: string = 'en') {
    const products = await this.prisma.product.findMany({
      include: { translations: { where: { locale } }, category: true }
    });
    return products.map(p => ({
      id: p.id, slug: p.slug, price: p.basePrice, image: p.image, stock: p.stock,
      rating: p.rating, reviewCount: p.reviewCount, isPrime: p.isPrime,
      categoryId: p.categoryId, categoryName: p.category?.name,
      title: p.translations[0]?.title || p.slug,
      description: p.translations[0]?.description || ''
    }));
  }

  // 👈 新增：获取单个商品详情
  @Get(':id')
  async findOne(@Param('id') id: string, @Query('locale') locale: string = 'en') {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { translations: { where: { locale } }, category: true }
    });
    if (!product) throw new NotFoundException('Product not found');
    
    return {
      id: product.id, slug: product.slug, price: product.basePrice, image: product.image, 
      stock: product.stock, rating: product.rating, reviewCount: product.reviewCount, 
      isPrime: product.isPrime, categoryId: product.categoryId, categoryName: product.category?.name,
      title: product.translations[0]?.title || product.slug,
      description: product.translations[0]?.description || ''
    };
  }

  @Post()
  async create(@Body() body: any) {
    // ... 保持你原来的逻辑
    return this.prisma.product.create({
      data: {
        slug: body.slug || `product-${Date.now()}`, basePrice: body.price, image: body.image,
        stock: body.stock || 100, rating: 5.0, reviewCount: 0, isPrime: true, categoryId: body.categoryId || null,
        translations: { create: body.translations.map((t: any) => ({ locale: t.locale, title: t.title, description: t.description || '' })) }
      }
    });
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() body: any) {
    // ... 保持你原来的逻辑
    const product = await this.prisma.product.findUnique({ where: { id } });
    if (!product) throw new NotFoundException('Product not found');
    return this.prisma.product.update({
      where: { id },
      data: {
        basePrice: body.price, image: body.image, stock: body.stock, categoryId: body.categoryId || null,
        translations: {
          upsert: body.translations.map((t: any) => ({
            where: { productId_locale: { productId: id, locale: t.locale } },
            update: { title: t.title, description: t.description || '' },
            create: { locale: t.locale, title: t.title, description: t.description || '' }
          }))
        }
      }
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.product.delete({ where: { id } });
  }
}
