import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  @ApiProperty({
    example: 'john_doe',
    required: true,
    description: 'The username of the user, between 3 and 20 characters.',
  })
  username: string;

  @IsNotEmpty()
  @IsString()
  @Length(8, 20)
  @ApiProperty({
    example: 'P@ssw0rd!',
    required: true,
    description: 'The password of the user, between 8 and 20 characters.',
  })
  password: string;
}
