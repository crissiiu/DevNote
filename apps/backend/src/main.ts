import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Cho phép ứng dụng lắng nghe các tín hiệu tắt hệ thống để đóng kết nối DB sạch sẽ
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
