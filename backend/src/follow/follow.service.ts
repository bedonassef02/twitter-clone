import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
} from '@nestjs/common';
import { FollowDto } from './dto/follow.dto';
import { ProfileService } from '../profile/profile.service';
import { InjectModel } from '@nestjs/mongoose';
import { Follow } from './entities/follow.entity';
import { Model } from 'mongoose';
import { Profile } from '../profile/entities/profile.entity';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService,
  ) {}

  async create(createFollowDto: FollowDto): Promise<Follow> {
    const profile: Profile = await this.profileService.findByUsername(
      createFollowDto.username,
    );
    this.prepareFollowDto(createFollowDto, profile);
    this.validateSelfFollow(createFollowDto);
    await this.checkIfAlreadyFollowing(createFollowDto);
    return this.followModel.create(createFollowDto);
  }

  async findFollowing(followerId: string): Promise<Follow[]> {
    return this.followModel.find({ followerId, accepted: true }).exec();
  }

  async findFollowers(followingId: string): Promise<Follow[]> {
    return this.followModel.find({ followingId, accepted: true }).exec();
  }

  async findFollowRequests(followerId: string): Promise<Follow[]> {
    return this.followModel.find({ followerId, accepted: false }).exec();
  }

  async update(id: string): Promise<Follow> {
    return this.followModel
      .findByIdAndUpdate(id, { accepted: true }, { new: true })
      .exec();
  }

  async remove(id: string): Promise<void> {
    await this.followModel.findByIdAndDelete(id).exec();
  }

  private validateSelfFollow(createFollowDto: FollowDto): void {
    if (createFollowDto.followerId === createFollowDto.followingId.toString()) {
      throw new BadRequestException('You cannot follow yourself');
    }
  }

  async isFollowed(createFollowDto: FollowDto): Promise<boolean> {
    const follow = await this.followModel
      .findOne({
        followingId: createFollowDto.followingId,
        followerId: createFollowDto.followerId,
      })
      .exec();
    return !!follow;
  }

  private async checkIfAlreadyFollowing(
    createFollowDto: FollowDto,
  ): Promise<void> {
    const alreadyFollowing = await this.isFollowed(createFollowDto);
    if (alreadyFollowing) {
      throw new BadRequestException('You are already following this user');
    }
  }

  private prepareFollowDto(
    createFollowDto: FollowDto,
    profile: Profile,
  ): FollowDto {
    if (!profile.isPrivate) {
      createFollowDto.accepted = true;
    }
    createFollowDto.followingId = profile.user;
    return createFollowDto;
  }

  async countFollowing(userId: string): Promise<number> {
    return this.followModel
      .countDocuments({ followerId: userId, accepted: true })
      .exec();
  }

  async countFollowers(userId: string): Promise<number> {
    return this.followModel
      .countDocuments({ followingId: userId, accepted: true })
      .exec();
  }
}
