import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthModule } from './auth/auth.module';
import { CalculationsModule } from './calculations/calculations.module';

@Module({
  imports: [
    // 1. Load the .env file globally so all departments can safely read secrets
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. Connect to MongoDB using your environment variable
    MongooseModule.forRoot(process.env.MONGO_URI!),

    // 3. Register your newly generated departments
    AuthModule,
    CalculationsModule,
  ],
})
export class AppModule {}