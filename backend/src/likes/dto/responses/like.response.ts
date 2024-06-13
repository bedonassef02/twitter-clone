import { ApiProperty } from '@nestjs/swagger';

export class LikeResponse {
  @ApiProperty()
  id: number;
  @ApiProperty()
  user: string;
  @ApiProperty()
  post: string;
  @ApiProperty()
  createdAt: Date;
}
