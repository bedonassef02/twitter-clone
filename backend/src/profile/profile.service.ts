import { Injectable, NotFoundException } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './entities/profile.entity';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { LikesService } from '../likes/likes.service';
import { PostsService } from '../posts/posts.service';
import { FollowService } from '../follow/follow.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly usersService: UsersService,
    private readonly likesService: LikesService,
    private readonly postsService: PostsService,
    private readonly followService: FollowService,
  ) {}

  async findProfileByUsername(username: string): Promise<Profile> {
    const user = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException(`username ${username} not found`);
    }
    return this.profileModel.findOne({ user: user.id }).exec();
  }

  @OnEvent('profile.create')
  async handleProfileCreateEvent({ user }) {
    return this.profileModel.create({ user });
  }

  async getUserLikes(username: string) {
    const user = await this.usersService.findOne(username);
    return this.likesService.findUserLikes(user.id);
  }

  async getUserPosts(username: string) {
    const user = await this.usersService.findOne(username);
    return this.postsService.findUserPosts(user.id);
  }

  async getUserFollowing(username: string) {
    const profile = await this.findProfileByUsername(username);
    return this.followService.getFollowing(profile.user);
  }

  async getUserFollowers(username: string) {
    const profile = await this.findProfileByUsername(username);
    return this.followService.getFollowers(profile.user);
  }

  async update(userId: string, updateProfileDto: UpdateProfileDto) {
    return this.profileModel
      .findOneAndUpdate({ user: userId }, updateProfileDto, { new: true })
      .exec();
  }

  async findOne(user: string) {
    return this.profileModel.findOne({ user });
  }

  async count(username: string) {
    const user = await this.usersService.findOne(username);
    const userId = user.id;
    const [likesCount, postsCount, followersCount, followingCount, mediaCount] =
      await Promise.all([
        this.likesService.countUserLikes(userId),
        this.postsService.countUserPosts(userId),
        this.followService.countFollowers(userId),
        this.followService.countFollowing(userId),
        this.postsService.countUserMedia(userId),
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
