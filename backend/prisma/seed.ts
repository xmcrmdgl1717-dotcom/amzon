import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
const prisma = new PrismaClient();

async function main() {
  // 1. 创建管理员
  const hash = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { email: 'admin@test.com' },
    update: {},
    create: { email: 'admin@test.com', passwordHash: hash, role: 'ADMIN' },
  });

  // 2. 预置商品数据（完美还原前端的 40 个商品结构）
  const products = [
    { id: '1', title: 'Apple iPhone 15 Pro Max, 256GB', price: 1199.99, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', rating: 4.8, reviewCount: 12543 },
    { id: '2', title: 'Samsung 65" Class Neo QLED 4K', price: 1899.99, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', rating: 4.6, reviewCount: 8742 },
    { id: '3', title: 'Sony WH-1000XM5 Headphones', price: 399.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', rating: 4.7, reviewCount: 15632 },
    { id: '4', title: 'Apple MacBook Air 15-inch', price: 1299.99, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', rating: 4.9, reviewCount: 9876 },
    { id: '5', title: 'Amazon Echo Dot (5th Gen)', price: 49.99, image: 'https://images.unsplash.com/photo-1543512214-318c7553f230?w=400', rating: 4.5, reviewCount: 23451 },
    // 你可以把剩下 35 个商品继续补充在这里...
  ];

  // 清空旧数据（方便新增字段生效）
  await prisma.productTranslation.deleteMany({});
  await prisma.product.deleteMany({});

  // 写入新数据
  for (const p of products) {
    await prisma.product.create({
      data: {
        id: p.id,
        slug: `product-${p.id}`,
        basePrice: p.price,
        image: p.image,
        rating: p.rating,
        reviewCount: p.reviewCount,
        isPrime: true,
        translations: {
          create: [
            { locale: 'en', title: p.title, description: 'High quality product.' },
            { locale: 'id', title: `[ID] ${p.title}`, description: 'Produk berkualitas tinggi.' }
          ]
        }
      }
    });
  }
  console.log('Seed completed!');
}
main().finally(() => prisma.$disconnect());
