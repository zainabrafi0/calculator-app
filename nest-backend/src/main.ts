import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. THE BOUNCER (CORS)
  // Only let the React Delivery Truck in, and allow it to carry safes (cookies)
  app.enableCors({
    origin: 'http://localhost:5173', // Your exact React frontend URL
    credentials: true, // This allows the cookies to pass through!
  });

  app.use(cookieParser());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Automatically strips away extra/malicious data sent by hackers
  }));

  await app.listen(3000);
  console.log('🚀 NestJS Factory is open for business on port 5000');
}
bootstrap();