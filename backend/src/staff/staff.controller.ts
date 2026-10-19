import { Controller, Get, Post, Body, Delete, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcryptjs';

@Controller('staff')
export class StaffController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    const users = await this.prisma.user.findMany({ orderBy: { email: 'asc' } });
    return users.map(u => ({ id: u.id, name: u.name, email: u.email, role: u.role }));
  }

  @Post()
  async create(@Body() body: any) {
    const hash = await bcrypt.hash(body.password, 10);
    return this.prisma.user.create({
      data: { name: body.name, email: body.email, passwordHash: hash, role: body.role }
    });
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.prisma.user.delete({ where: { id } });
  }
}
