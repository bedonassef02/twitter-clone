import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ParseMongoIdPipe } from '../utils/pipes/parse-mongo-id.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PostsGuard } from './guards/posts.guard';
import { PostResponse } from './dto/responses/post.response';
import { PostCountResponse } from './dto/responses/post-count.response';
import { PostDocument } from './entities/post.entity';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 4 }]))
  @ApiCreatedResponse({
    type: PostResponse,
  })
  create(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @User('id') userId: string,
    @Body() createPostDto: CreatePostDto,
  ): Promise<PostDocument> {
    if (files.images) {
      createPostDto.images = files.images.map((file) => {
        return file.filename;
      });
    }

    createPostDto.user = userId;
    return this.postsService.create(createPostDto);
  }

  @Get()
  @ApiOkResponse({
    type: PostResponse,
    isArray: true,
  })
  findAll() {
    return this.postsService.findAll();
  }

  @UseGuards(PostsGuard)
  @Get(':id')
  @ApiOkResponse({
    type: PostResponse,
  })
  @UsePipes(ParseMongoIdPipe)
  findOne(@Param('id') id: string): Promise<PostDocument> {
    return this.postsService.findOne(id);
  }

  @UseGuards(PostsGuard)
  @Get(':id/count')
  @ApiOkResponse({
    type: PostCountResponse,
  })
  @UsePipes(ParseMongoIdPipe)
  @UseInterceptors(CacheInterceptor)
  count(@Param('id') id: string): Promise<PostCountResponse> {
    return this.postsService.findCount(id);
  }

  @UseGuards(PostsGuard)
  @Delete(':id')
  @ApiNoContentResponse()
  @UsePipes(ParseMongoIdPipe)
  remove(@User('id') userId: string, @Param('id') id: string): Promise<void> {
    return this.postsService.remove(userId, id);
  }
}
