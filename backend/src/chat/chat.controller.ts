import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatDto } from './dto/chat.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Chat')
@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post()
  create(@User('id') user: string, @Body() chatDto: ChatDto) {
    chatDto.senderId = user;
    return this.chatService.create(chatDto);
  }

  @Get()
  findAll(@User('id') user: string) {
    return this.chatService.findAll(user);
  }

  @Get(':id')
  findOne(@User('id') user: string, @Param('id') id: string) {
    return this.chatService.findOne(user, id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatService.remove(id);
  }

  @Delete(':id/clear')
  clear(@User('id') user: string, @Param('id') id: string) {
    return this.chatService.clear(user, id);
  }
}
