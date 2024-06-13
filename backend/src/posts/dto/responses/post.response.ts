import { ApiProperty } from '@nestjs/swagger';

export class PostResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  user: string;
  @ApiProperty()
  repost: string;
  @ApiProperty()
  content: string;
  @ApiProperty()
  images: string[];
  @ApiProperty()
  type: string;
  @ApiProperty()
  createdAt: Date;
}
