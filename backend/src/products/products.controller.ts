import { Controller, Get, Query } from '@nestjs/common';
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
      id: p.id, slug: p.slug, price: p.basePrice, image: p.image, stock: p.stock,
      title: p.translations[0]?.title || p.slug, description: p.translations[0]?.description || ''
    }));
  }
}
