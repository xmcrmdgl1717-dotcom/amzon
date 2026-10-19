import { Controller, Get, Post, Delete, Body, Param, Patch } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('banners')
export class BannersController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.banner.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } });
  }

  @Get('admin')
  async findAllAdmin() {
    return this.prisma.banner.findMany({ orderBy: { order: 'asc' } });
  }

  @Post()
  async create(@Body() body: any) {
    return this.prisma.banner.create({
      data: {
        imageUrl: body.imageUrl,
        linkUrl: body.linkUrl || null,
        isActive: body.isActive !== undefined ? body.isActive : true,
        order: body.order || 0
      }
    });
  }

  @Patch(':id/toggle')
  async toggle(@Param('id') id: string) {
    const banner = await this.prisma.banner.findUnique({ where: { id } });
    return this.prisma.banner.update({
      where: { id },
      data: { isActive: !banner.isActive }
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.banner.delete({ where: { id } });
  }
}
