import { ApiProperty } from '@nestjs/swagger';

export class PostCountResponse {
  @ApiProperty()
  comments: number;
  @ApiProperty()
  likes: number;
  @ApiProperty()
  reposts: number;
}
