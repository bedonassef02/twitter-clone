import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ParseMongoIdPipe } from '../utils/pipes/parse-mongo-id.pipe';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Posts')
@ApiBearerAuth()
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Post()
  @UseInterceptors(FileFieldsInterceptor([{ name: 'images', maxCount: 4 }]))
  create(
    @UploadedFiles() files: { images?: Express.Multer.File[] },
    @User('id') userId: string,
    @Body() createPostDto: CreatePostDto,
  ) {
    if (files.images) {
      createPostDto.images = files.images.map((file) => {
        return file.filename;
      });
    }

    createPostDto.user = userId;
    return this.postsService.create(createPostDto);
  }

  @Get()
  findAll() {
    return this.postsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseMongoIdPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Delete(':id')
  remove(@User('id') userId: string, @Param('id') id: string) {
    return this.postsService.remove(userId, id);
  }
}
