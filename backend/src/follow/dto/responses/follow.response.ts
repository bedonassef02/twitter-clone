import { ApiProperty } from '@nestjs/swagger';

export class FollowResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  followerId: string;
  @ApiProperty()
  followingId: string;
  @ApiProperty()
  accepted: boolean;
}
