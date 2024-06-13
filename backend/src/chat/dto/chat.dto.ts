import { IsMongoId, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ChatDto {
  senderId: string;
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '665db6f16acfd905f4e909ff',
    required: true,
    description: 'The MongoDB ObjectId of the user receiving the message.',
  })
  receiverId: string;
  @IsNotEmpty()
  @IsString()
  @ApiProperty({
    example: 'Hello, how are you?',
    required: true,
    description: 'The content of the chat message.',
  })
  content: string;
}
