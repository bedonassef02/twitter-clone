import { IsCurrency, IsNumber, IsPositive, IsString } from 'class-validator';

export class CreateBillingDto {
  @IsNumber()
  @IsPositive()
  amount: number;
  @IsCurrency()
  currency: string;
  @IsString()
  customer: string;
  @IsString()
  source: string;
}
