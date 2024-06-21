import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { IsUnique } from '../utils/decorators/is-unique.decorator';

export class RegisterDto {
  @IsNotEmpty()
  @IsString()
  @Length(1, 20)
  @ApiProperty({
    example: 'John Doe',
    required: true,
    description: 'The name of the user, between 1 and 20 characters.',
  })
  name: string;

  @IsNotEmpty()
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  @IsUnique()
  @ApiProperty({
    example: 'john_doe',
    required: true,
    description:
      'The unique username of the user, between 3 and 20 characters.',
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
