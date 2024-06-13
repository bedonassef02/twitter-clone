import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Profile } from '../entities/profile.entity';
import { UsersService } from '../../users/users.service';
import { LikesService } from '../../likes/likes.service';
import { PostsStatusService } from '../../posts/utils/services/posts-status.service';
import { FollowService } from '../../follow/follow.service';

@Injectable()
export class ProfileStatusService {
  constructor(
    @InjectModel(Profile.name)
    private readonly usersService: UsersService,
    private readonly likesService: LikesService,
    private readonly postsStatusService: PostsStatusService,
    private readonly followService: FollowService,
  ) {}

  async count(username: string) {
    const user = await this.usersService.findOne(username);
    const userId = user.id;
    const [likesCount, postsCount, followersCount, followingCount, mediaCount] =
      await Promise.all([
        this.likesService.countUserLikes(userId),
        this.postsStatusService.countUserPosts(userId),
        this.followService.countFollowers(userId),
        this.followService.countFollowing(userId),
        this.postsStatusService.countUserMedia(userId),
      ]);
    return {
      likes: likesCount,
      posts: postsCount,
      followers: followersCount,
      following: followingCount,
      media: mediaCount,
    };
  }
}
