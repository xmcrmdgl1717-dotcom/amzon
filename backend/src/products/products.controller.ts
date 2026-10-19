import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('products')
export class ProductsController {
  constructor(private prisma: PrismaService) {}

  // 获取商品列表（支持多语言）
  @Get()
  async findAll(@Query('locale') locale: string = 'en') {
    const products = await this.prisma.product.findMany({
      include: { translations: { where: { locale } } }
    });
    
    // 将关联的翻译数据拍平，方便前端直接使用
    return products.map(p => ({
      id: p.id,
      slug: p.slug,
      price: p.basePrice,
      image: p.image,
      stock: p.stock,
      title: p.translations[0]?.title || p.slug,
      description: p.translations[0]?.description || ''
    }));
  }

  // 新增商品（供后台管理使用）
  @Post()
  async create(@Body() body: any) {
    return this.prisma.product.create({
      data: {
        slug: body.slug || `product-${Date.now()}`,
        basePrice: body.price,
        image: body.image || 'https://via.placeholder.com/150',
        stock: body.stock || 100,
        translations: {
          create: [
            { 
              locale: 'en', 
              title: body.title, 
              description: body.description || '' 
            }
          ]
        }
      }
    });
  }
}
