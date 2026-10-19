import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { json } from 'express'; // 👈 新增

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.use(json({ limit: '10mb' })); // 👈 允许 10MB 的请求体
  app.enableCors();
  
  await app.listen(process.env.PORT || 3000);
  console.log('Backend running on port', process.env.PORT || 3000);
}
bootstrap();
