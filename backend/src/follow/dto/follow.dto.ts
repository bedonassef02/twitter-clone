import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class FollowDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'john_doe',
    required: true,
    description: 'The username of the user being followed.',
  })
  username?: string;
  followerId: string;
  followingId: string;
  accepted?: boolean;
}
