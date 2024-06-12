import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';

export class ChatDto {
  senderId: string;
  @IsNotEmpty()
  @IsMongoId()
  receiverId: string;
  @IsNotEmpty()
  @IsString()
  content: string;
}
