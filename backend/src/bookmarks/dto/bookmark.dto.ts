import { IsMongoId, IsNotEmpty } from 'class-validator';

export class BookmarkDto {
  @IsNotEmpty()
  @IsMongoId()
  post: string;
  user: string;
}
