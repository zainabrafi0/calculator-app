import { IsString, IsNotEmpty } from 'class-validator';

export class CreateCalculationDto {
  @IsString()
  @IsNotEmpty({ message: 'Expression cannot be empty' })
  expression!: string;
}