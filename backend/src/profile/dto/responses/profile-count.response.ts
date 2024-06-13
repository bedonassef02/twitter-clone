import { ApiProperty } from '@nestjs/swagger';

export class ProfileCountResponse {
  @ApiProperty()
  likes: number;
  @ApiProperty()
  posts: number;
  @ApiProperty()
  followers: number;
  @ApiProperty()
  following: number;
  @ApiProperty()
  media: number;
}
