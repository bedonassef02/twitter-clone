import { Injectable } from '@nestjs/common';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Profile, ProfileDocument } from './entities/profile.entity';
import { Model } from 'mongoose';
import { UsersService } from '../users/users.service';
import { UserDocument } from '../users/entities/user.entity';
import { LikesService } from '../likes/likes.service';
import { PostsService } from '../posts/posts.service';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class ProfileService {
  constructor(
    @InjectModel(Profile.name)
    private readonly profileModel: Model<ProfileDocument>,
    private readonly usersService: UsersService,
    private readonly likesService: LikesService,
    private readonly postsService: PostsService,
  ) {}

  async findOne(username: string) {
    const user: UserDocument = await this.usersService.findOne(username);
    return this.profileModel.findOne({ user: user.id });
  }

  @OnEvent('profile.create')
  async create({ user }) {
    return this.profileModel.create({ user });
  }

  async findOneLikes(username: string) {
    const user: UserDocument = await this.usersService.findOne(username);
    return this.likesService.findUserLikes(user.id);
  }

  async findOnePosts(username: string) {
    const user: UserDocument = await this.usersService.findOne(username);
    return this.postsService.findUserPosts(user.id);
  }

  update(id: string, updateProfileDto: UpdateProfileDto) {
    return this.profileModel.findOneAndUpdate({ user: id }, updateProfileDto, {
      new: true,
    });
  }
}
