import { IsIn, IsMongoId, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '665c6fac1ce871cc5fedcebe',
    required: true,
    description:
      'The MongoDB ObjectId of the post associated with the notification.',
  })
  post: string;
  @IsNotEmpty()
  @IsIn(['repost', 'comment', 'like'])
  @ApiProperty({
    example: 'like',
    required: true,
    description:
      'The type of notification, which can be "repost", "comment", or "like".',
  })
  type: string;
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '665db6f16acfd905f4e909ff',
    required: true,
    description:
      'The MongoDB ObjectId of the user who triggered the notification.',
  })
  from: string;
  user: string;
}
