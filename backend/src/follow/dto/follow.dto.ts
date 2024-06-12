import { IsNotEmpty, IsString } from 'class-validator';

export class FollowDto {
  @IsNotEmpty()
  @IsString()
  username: string;
  followerId: string;
  followingId: string;
  accepted: boolean;
}
