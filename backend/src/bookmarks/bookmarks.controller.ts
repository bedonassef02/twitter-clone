import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarkDto } from './dto/bookmark.dto';
import { User } from '../users/utils/decorators/user.decorator';

@Controller('bookmarks')
export class BookmarksController {
  constructor(private readonly bookmarksService: BookmarksService) {}

  @Post()
  create(@User('id') user: string, @Body() bookmarkDto: BookmarkDto) {
    bookmarkDto.user = user;
    return this.bookmarksService.create(bookmarkDto);
  }

  @Get()
  findAll(@User('id') user: string) {
    return this.bookmarksService.findAll(user);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.bookmarksService.remove(id);
  }
}
