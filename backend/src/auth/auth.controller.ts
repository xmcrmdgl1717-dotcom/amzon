import { Controller, Post, Body } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
@Controller('auth')
export class AuthController {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}
  @Post('login')
  async login(@Body() body: any) {
    const user = await this.prisma.user.findUnique({ where: { email: body.email } });
    if (!user || !(await bcrypt.compare(body.password, user.passwordHash))) throw new Error('Invalid');
    return { accessToken: this.jwt.sign({ sub: user.id, role: user.role }) };
  }
}
