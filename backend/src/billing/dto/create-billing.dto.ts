import { IsIn, IsString } from 'class-validator';

export class CreateBillingDto {
  @IsString()
  @IsIn(['prod_QOrN3qCgWmQdiZ', 'prod_QOrMfjde4p0fy9', 'prod_QOrLgk1HFH9ndU'])
  priceId: string;
}
