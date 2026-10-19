import { Controller, Post, Body, Get, UnauthorizedException, Param } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';

@Controller('customers')
export class CustomersController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  @Post('register')
  async register(@Body() body: any) {
    const existing = await this.prisma.customer.findUnique({ where: { email: body.email } });
    if (existing) throw new UnauthorizedException('Email already exists');

    const hash = await bcrypt.hash(body.password, 10);
    const customer = await this.prisma.customer.create({
      data: { name: body.name, email: body.email, passwordHash: hash }
    });
    return this.generateToken(customer);
  }

  @Post('login')
  async login(@Body() body: any) {
    const customer = await this.prisma.customer.findUnique({ where: { email: body.email } });
    if (!customer || !(await bcrypt.compare(body.password, customer.passwordHash))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.generateToken(customer);
  }

  @Get()
  async getAllCustomers() {
    const customers = await this.prisma.customer.findMany({ orderBy: { createdAt: 'desc' } });
    return customers.map(c => ({ id: c.id, name: c.name, email: c.email, createdAt: c.createdAt }));
  }

  // 👈 新增：获取某个买家的订单历史
  @Get(':id/orders')
  async getMyOrders(@Param('id') id: string) {
    return this.prisma.order.findMany({
      where: { customerId: id },
      include: { items: { include: { product: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }

  private generateToken(customer: any) {
    return {
      accessToken: this.jwt.sign({ sub: customer.id, email: customer.email, role: 'CUSTOMER' }),
      user: { id: customer.id, name: customer.name, email: customer.email }
    };
  }
}
