import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JwtModule } from '@nestjs/jwt';
import { CalculationsService } from './calculations.service';
import { CalculationsController } from './calculations.controller';
import { Calculation, CalculationSchema } from './schemas/calculation.schema';

@Module({
  imports: [
    // THIS is the magic line fixing your error! It officially registers the database model.
    MongooseModule.forFeature([{ name: Calculation.name, schema: CalculationSchema }]),
    
    // Required so the VIP Bouncer can read the cookies
    JwtModule.register({}), 
  ],
  controllers: [CalculationsController],
  providers: [CalculationsService],
})
export class CalculationsModule {}