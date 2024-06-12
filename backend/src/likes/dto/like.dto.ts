import { IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LikeDto {
  user: string;
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    required: true,
    description: 'The ID of the post that is liked.',
  })
  post: string;
}
