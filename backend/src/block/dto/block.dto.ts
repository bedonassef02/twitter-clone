import { IsMongoId, IsNotEmpty } from 'class-validator';

export class BlockDto {
  @IsNotEmpty()
  @IsMongoId()
  blockedUserId: string;
  userId: string;
}
