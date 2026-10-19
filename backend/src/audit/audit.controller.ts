import { Controller, Get } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Controller('audit-logs')
export class AuditController {
  constructor(private prisma: PrismaService) {}

  @Get()
  async findAll() {
    return this.prisma.auditLog.findMany({
      include: { user: { select: { name: true, email: true } } },
      orderBy: { createdAt: 'desc' }
    });
  }
}
