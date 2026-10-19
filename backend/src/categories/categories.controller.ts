import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('categories')
export class CategoriesController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.category.findMany();
  }

  @Post()
  async create(@Body() body: { name: string }) {
    return this.prisma.category.create({ data: { name: body.name } });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
