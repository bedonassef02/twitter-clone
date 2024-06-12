import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PostsService } from '../posts/posts.service';

@Injectable()
export class SearchService {
  constructor(
    private readonly usersService: UsersService,
    private readonly postsService: PostsService,
  ) {}
  searchForAccount(keyword: string) {
    return this.usersService.search(keyword);
  }

  searchForPosts(keyword: string) {
    return this.postsService.search(keyword);
  }
}
