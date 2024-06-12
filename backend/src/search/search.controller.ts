import { Controller, Get, Param } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('account/:keyword')
  searchForAccount(@Param('keyword') keyword: string) {
    return this.searchService.searchForAccount(keyword);
  }

  @Get('posts/:keyword')
  searchForPosts(@Param('keyword') keyword: string) {
    return this.searchService.searchForPosts(keyword);
  }
}
