import { IsMongoId, IsNotEmpty } from 'class-validator';
import {ApiProperty} from "@nestjs/swagger";

export class BlockDto {
  @IsNotEmpty()
  @IsMongoId()
  @ApiProperty({
    example: '665db6f16acfd905f4e909ff',
    required: true,
    description: 'The MongoDB ObjectId of the user to be blocked.',
  })
  blockedUserId: string;
  userId: string;
}
