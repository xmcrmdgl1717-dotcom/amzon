import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.category.findMany({ include: { _count: { select: { products: true } } } });
  }

  @Post()
  async create(@Body() body: any) {
    return this.prisma.category.create({ data: { name: body.name } });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
