import {
  IsArray,
  IsIn,
  IsMongoId,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostDto {
  @IsOptional()
  @IsString()
  @MaxLength(2096)
  @ApiProperty({
    example: 'This is a sample post content.',
    description: 'The content of the post, up to 2096 characters.',
    required: false,
  })
  content?: string;
  user: string;

  @IsOptional()
  @IsMongoId()
  @ApiProperty({
    example: '60d0fe4f5311236168a109cb',
    description: 'The ID of the post being reposted, if applicable.',
    required: false,
  })
  repost?: string;

  @IsOptional()
  @IsArray()
  @MaxLength(4)
  @IsString({ each: true })
  @ApiProperty({
    example: ['image1.jpg', 'image2.jpg'],
    description:
      'An array of image URLs associated with the post, up to 4 images.',
    required: false,
    type: [String],
  })
  images?: string[];

  @IsOptional()
  @IsString()
  @IsIn(['post', 'comment', 'repost'])
  @ApiProperty({
    example: 'post',
    description:
      'The type of the post, which can be either "post", "comment", or "repost".',
    required: false,
    enum: ['post', 'comment', 'repost'],
  })
  type?: string;
}
