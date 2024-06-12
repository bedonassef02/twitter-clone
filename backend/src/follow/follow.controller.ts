import { Controller, Post, Body, Param, Delete, Get } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowDto } from './dto/follow.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Follow')
@Controller('follow')
export class FollowController {
  constructor(private readonly followService: FollowService) {}

  @Post()
  create(@User('id') followerId: string, @Body() createFollowDto: FollowDto) {
    createFollowDto.followerId = followerId;
    return this.followService.create(createFollowDto);
  }

  @Get()
  findAll(@User('id') id: string) {
    return this.followService.getFollowRequests(id);
  }
  @Post(':id')
  accept(@Param('id') id: string) {
    return this.followService.update(id);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.followService.remove(id);
  }
}
