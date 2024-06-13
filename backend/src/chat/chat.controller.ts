import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ChatDocument } from './entities/chat.entity';

@ApiTags('Chat')
@ApiBearerAuth()
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(
    @User('id') user: string,
    @Body() chatDto: ChatDto,
  ): Promise<ChatDocument> {
    chatDto.senderId = user;
    return this.chatService.create(chatDto);
  }

  @Get()
  findAll(@User('id') user: string): Promise<ChatDocument[]> {
    return this.chatService.findAll(user);
  }

  @Get(':id')
  findOne(
    @User('id') user: string,
    @Param('id') id: string,
  ): Promise<ChatDocument[]> {
    return this.chatService.findOne(user, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<any> {
    return this.chatService.remove(id);
  }

  @Delete(':id/clear')
  async clear(
    @User('id') user: string,
    @Param('id') id: string,
  ): Promise<void> {
    await this.chatService.clear(user, id);
  }
}
