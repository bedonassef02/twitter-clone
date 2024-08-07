import { Injectable } from '@nestjs/common';
import { PostsService } from '../posts.service';
import { ProfileService } from '../../profile/profile.service';
import { FollowService } from '../../follow/follow.service';
import { Profile } from '../../profile/entities/profile.entity';

@Injectable()
export class GuardService {
  constructor(
    private readonly postsService: PostsService,
    private readonly profileService: ProfileService,
    private readonly followService: FollowService,
  ) {}

  async isAuth(user: string, postId: string): Promise<boolean> {
    if (!postId) {
      return true;
    }

    const post = await this.getPost(postId);
    if (!post) {
      return false;
    }

    if (this.isPostOwner(post.user, user)) {
      return true;
    }

    const profile = await this.getProfile(post.user);
    if (!profile) {
      return false;
    }

    if (!this.isProfilePrivate(profile)) {
      return true;
    }

    return this.isUserFollowing(user, post.user);
  }

  private async getPost(postId: string) {
    return this.postsService.findOne(postId);
  }

  private isPostOwner(postUser: string, user: string): boolean {
    // TODO: improve logic here
    return true;
    // return postUser.toString() === user;
  }
  getProfile(username: string): Promise<Profile> {
    return this.profileService.findByUsername(username);
  }

  isProfilePrivate(profile: any): boolean {
    return profile.isPrivate;
  }

  async isUserFollowing(userId: string, postUserId: string): Promise<boolean> {
    return this.followService.isFollowed({
      followerId: userId,
      followingId: postUserId,
    });
  }
}
