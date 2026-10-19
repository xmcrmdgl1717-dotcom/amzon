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

  // 👈 预置几个基础分类
  const electronics = await prisma.category.upsert({
    where: { name: 'Electronics' }, update: {}, create: { name: 'Electronics' }
  });
  const books = await prisma.category.upsert({
    where: { name: 'Books' }, update: {}, create: { name: 'Books' }
  });
  const home = await prisma.category.upsert({
    where: { name: 'Home & Kitchen' }, update: {}, create: { name: 'Home & Kitchen' }
  });

  const products = [
    { id: '1', title: 'Apple iPhone 15 Pro Max, 256GB', price: 1199.99, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', rating: 4.8, reviewCount: 12543, catId: electronics.id },
    { id: '2', title: 'Samsung 65" Class Neo QLED 4K', price: 1899.99, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=400', rating: 4.6, reviewCount: 8742, catId: electronics.id },
    { id: '3', title: 'Sony WH-1000XM5 Headphones', price: 399.99, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', rating: 4.7, reviewCount: 15632, catId: electronics.id },
    { id: '23', title: 'The Seven Husbands of Evelyn Hugo', price: 16.99, image: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', rating: 4.8, reviewCount: 45623, catId: books.id },
    { id: '31', title: 'KitchenAid Stand Mixer, 5-Qt', price: 449.99, image: 'https://images.unsplash.com/photo-1595644258096-69155da290fd?w=400', rating: 4.8, reviewCount: 18765, catId: home.id },
  ];

  await prisma.productTranslation.deleteMany({});
  await prisma.product.deleteMany({});

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
        categoryId: p.catId,
        translations: {
          create: [
            { locale: 'en', title: p.title, description: 'High quality product.' },
            { locale: 'id', title: `[ID] ${p.title}`, description: 'Produk berkualitas tinggi.' }
          ]
        }
      }
    });
  }
  console.log('Seed completed with Categories!');
}
main().finally(() => prisma.$disconnect());
