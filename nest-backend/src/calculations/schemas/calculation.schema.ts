import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type CalculationDocument = Calculation & Document;

@Schema({ timestamps: true })
export class Calculation {
  @Prop({ required: true })
  userId!: string;

  // We deleted num1, num2, and operation, and replaced them with this:
  @Prop({ required: true })
  expression!: string;

  @Prop({ required: true })
  result!: number;
}

export const CalculationSchema = SchemaFactory.createForClass(Calculation);