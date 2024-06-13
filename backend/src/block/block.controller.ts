import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BlockService } from './block.service';
import { BlockDto } from './dto/block.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BlockDocument } from './entities/block.entity';

@ApiTags('Block')
@ApiBearerAuth()
@Controller('block')
export class BlockController {
  constructor(private readonly blockService: BlockService) {}

  @Post()
  create(
    @User('id') userId: string,
    @Body() blockDto: BlockDto,
  ): Promise<BlockDocument> {
    blockDto.userId = userId;
    return this.blockService.create(blockDto);
  }

  @Get()
  findAll(@User('id') userId: string): Promise<BlockDocument[]> {
    return this.blockService.findAll(userId);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.blockService.remove(id);
  }
}
