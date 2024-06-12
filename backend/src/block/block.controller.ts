import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockDto } from './dto/block.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Block')
@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  create(@User('id') userId: string, @Body() blockDto: BlockDto) {
    blockDto.userId = userId;
    return this.blockService.create(blockDto);
  }

  @Get()
  findAll(@User('id') userId: string) {
    return this.blockService.findAll(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blockService.remove(id);
  }
}
