import { IsMongoId, IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class BookmarkDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '665c6fac1ce871cc5fedcebe',
    required: true,
    description: 'The MongoDB ObjectId of the post to be bookmarked.',
  })
  post: string;
  user: string;
}
