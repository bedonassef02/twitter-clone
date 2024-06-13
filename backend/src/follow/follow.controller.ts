import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Follow } from './entities/follow.entity';

@ApiTags('Follow')
@ApiBearerAuth()
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  create(
    @User('id') followerId: string,
    @Body() createFollowDto: FollowDto,
  ): Promise<Follow> {
    createFollowDto.followerId = followerId;
    return this.followService.create(createFollowDto);
  }

  @Get('requests')
  findAll(@User('id') id: string): Promise<Follow[]> {
    return this.followService.findFollowRequests(id);
  }
  @Post(':id')
  accept(@Param('id') id: string): Promise<Follow> {
    return this.followService.update(id);
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<void> {
    await this.followService.remove(id);
  }
}
