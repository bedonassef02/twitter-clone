import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
} from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BookmarkDocument } from './entities/bookmark.entity';
import { ParseMongoIdPipe } from '../utils/pipes/parse-mongo-id.pipe';

@ApiTags('Bookmarks')
@ApiBearerAuth()
@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(
    @User('id') user: string,
    @Body() bookmarkDto: BookmarkDto,
  ): Promise<BookmarkDocument> {
    bookmarkDto.user = user;
    return this.bookmarksService.create(bookmarkDto);
  }

  @Get()
  findAll(@User('id') user: string): Promise<BookmarkDocument[]> {
    return this.bookmarksService.findAll(user);
  }

  @Delete(':id')
  @UsePipes(ParseMongoIdPipe)
  remove(@Param('id') id: string) {
    return this.bookmarksService.remove(id);
  }
}
