import {
  IsBoolean,
  IsDate,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class UpdateProfileDto {
  @IsOptional()
  @IsString()
  @MaxLength(256)
  @ApiProperty({
    example: 'Software developer with a passion for open-source projects.',
    description: 'A short biography of the user, up to 256 characters.',
    required: false,
  })
  bio: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  @ApiProperty({
    example: '1990-01-01',
    description: 'The birth date of the user.',
    required: false,
    type: String,
    format: 'date-time',
  })
  birthDate: Date;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  @ApiProperty({
    example: 'San Francisco, CA',
    description: 'The location of the user, up to 64 characters.',
    required: false,
  })
  location: string;

  @IsOptional()
  @IsUrl()
  @ApiProperty({
    example: 'https://www.example.com',
    description: 'The personal website of the user.',
    required: false,
  })
  website: string;

  @IsOptional()
  @IsBoolean()
  @ApiProperty({
    example: true,
    description: 'Indicates whether the user profile is private.',
    required: false,
  })
  isPrivate: boolean;
}
