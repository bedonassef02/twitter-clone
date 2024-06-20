import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { LikesService } from './likes.service';
import { LikeDto } from './dto/like.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ParseMongoIdPipe } from '../utils/pipes/parse-mongo-id.pipe';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { LikePostsGuard } from '../posts/guards/like-posts.guard';
import { LikeDocument } from './entities/like.entity';

@ApiTags('Likes')
@ApiBearerAuth()
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @UseGuards(LikePostsGuard)
  @Patch()
  toggle(
    @User('id') user: string,
    @Body() likeDto: LikeDto,
  ): Promise<LikeDocument | null> {
    likeDto.user = user;
    return this.likesService.toggle(likeDto);
  }

  @Get()
  findAll(
    @Query('post', ParseMongoIdPipe) post: string,
  ): Promise<LikeDocument[]> {
    return this.likesService.findAll(post);
  }
  @Get(':id')
  @UsePipes(ParseMongoIdPipe)
  findOne(
    @User('id') user: string,
    @Param('id') post: string,
  ): Promise<LikeDocument> {
    return this.likesService.findOne({ user, post });
  }
}
