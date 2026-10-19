import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { email: 'admin@test.com', passwordHash: hash, role: 'ADMIN' },
  });

  const products = [
    { id: '1', slug: 'iphone-15', basePrice: 1199.99, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400' },
    { id: '2', slug: 'samsung-tv', basePrice: 1899.99, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400' },
    { id: '3', slug: 'sony-headphones', basePrice: 399.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id, slug: p.slug, basePrice: p.basePrice, image: p.image,
        translations: {
          create: [
            { locale: 'en', title: p.slug + ' (EN)', description: 'English description' },
            { locale: 'id', title: p.slug + ' (ID)', description: 'Deskripsi Indonesia' }
          ]
        }
      }
    });
  }
  console.log('Seed completed!');
}
main().finally(() => prisma.$disconnect());
