import {
  IsEmail,
  IsIn,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class UpdateAccountDto {
  @IsOptional()
  @IsPhoneNumber()
  phone: string;
  @IsOptional()
  @IsEmail()
  email: string;
  @IsOptional()
  @IsString()
  country: string;
  @IsOptional()
  @IsString()
  @IsIn(['male', 'female'])
  gender: string;
}
