import { IsIn, IsMongoId, IsNotEmpty } from 'class-validator';

export class CreateNotificationDto {
  @IsNotEmpty()
  @IsMongoId()
  post: string;
  @IsNotEmpty()
  @IsIn(['repost', 'comment', 'like'])
  type: string;
  @IsNotEmpty()
  @IsMongoId()
  from: string;
  user: string;
}
