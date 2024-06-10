import { Controller, Get, Body, Patch, Param, Query } from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikeDto } from './dto/like.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ParseMongoIdPipe } from '../utils/pipes/parse-mongo-id.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Likes')
@ApiBearerAuth()
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Patch()
  toggle(@User('id') user: string, @Body() likeDto: LikeDto) {
    likeDto.user = user;
    return this.likesService.toggle(likeDto);
  }

  @Get()
  findAll(@Query('post', ParseMongoIdPipe) post: string) {
    return this.likesService.findAll(post);
  }
  @Get(':id')
  findOne(@User('id') user: string, @Param('id') post: string) {
    return this.likesService.findOne({ user, post });
  }
}
