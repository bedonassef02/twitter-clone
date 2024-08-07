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
import { Follow } from '../follow/entities/follow.entity';
import { UserDocument } from '../users/entities/user.entity';
import { PostDocument } from '../posts/entities/post.entity';
import { LikeDocument } from '../likes/entities/like.entity';
import { ProfileCountResponse } from './dto/responses/profile-count.response';
import { PostsStatusService } from '../posts/utils/services/posts-status.service';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly usersService: UsersService,
    private readonly likesService: LikesService,
    private readonly postsService: PostsService,
    private readonly followService: FollowService,
    private readonly postsStatusService: PostsStatusService,
  ) {}

  async findByUsername(username: string): Promise<Profile> {
    const user: UserDocument = await this.usersService.findOne(username);
    if (!user) {
      throw new NotFoundException(`username ${username} not found`);
    }
    return this.profileModel.findOne({ user: user.id }).exec();
  }

  @OnEvent('profile.findOne')
  async findByUserId(user: string): Promise<Profile> {
    return this.profileModel.findOne({ user }).exec();
  }

  @OnEvent('profile.create')
  async handleProfileCreateEvent({ user }): Promise<Profile> {
    return this.profileModel.create({ user });
  }

  async findLikes(username: string): Promise<LikeDocument[]> {
    const user: UserDocument = await this.usersService.findOne(username);
    return this.likesService.findUserLikes(user.id);
  }

  async findPosts(username: string): Promise<PostDocument[]> {
    const user: UserDocument = await this.usersService.findOne(username);
    return this.postsService.findUserPosts(user.id);
  }

  async findFollowing(username: string): Promise<Follow[]> {
    const profile: Profile = await this.findByUsername(username);
    return this.followService.findFollowing(profile.user);
  }

  async findFollowers(username: string): Promise<Follow[]> {
    const profile: Profile = await this.findByUsername(username);
    return this.followService.findFollowers(profile.user);
  }

  @OnEvent('profile.update')
  async update(
    userId: string,
    updateProfileDto: UpdateProfileDto,
  ): Promise<Profile> {
    return this.profileModel
      .findOneAndUpdate({ user: userId }, updateProfileDto, { new: true })
      .exec();
  }

  async findOne(user: string): Promise<Profile> {
    return this.profileModel.findOne({ user });
  }

  async count(username: string): Promise<ProfileCountResponse> {
    const profile: Profile = await this.findByUsername(username);
    const userId: string = profile.user;
    const [likes, posts, followers, following, media] = await Promise.all([
      this.likesService.countUserLikes(userId),
      this.postsStatusService.countUserPosts(userId),
      this.followService.countFollowers(userId),
      this.followService.countFollowing(userId),
      this.postsStatusService.countUserMedia(userId),
    ]);
    return {
      likes,
      posts,
      followers,
      following,
      media,
    };
  }
}
