import { IsMongoId, IsNotEmpty } from "class-validator";

export class CreateFollowDto {
  @IsNotEmpty()
  @IsMongoId()
  followingId: string;
  followerId: string;
  accepted: boolean;
}
