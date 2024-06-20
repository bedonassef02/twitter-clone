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
import { NotificationDto } from '../notifications/dto/notification.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class FollowService {
  constructor(
    @InjectModel(Follow.name) private readonly followModel: Model<Follow>,
    @Inject(forwardRef(() => ProfileService))
    private readonly profileService: ProfileService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(followDto: FollowDto): Promise<Follow> {
    const profile: Profile = await this.profileService.findByUsername(
      followDto.username,
    );
    this.prepareFollowDto(followDto, profile);
    this.validateSelfFollow(followDto);
    await this.checkIfAlreadyFollowing(followDto);
    this.createFollowNotification(followDto);
    return this.followModel.create(followDto);
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

  private validateSelfFollow(followDto: FollowDto): void {
    if (followDto.followerId === followDto.followingId.toString()) {
      throw new BadRequestException('You cannot follow yourself');
    }
  }

  async isFollowed(followDto: FollowDto): Promise<boolean> {
    const follow = await this.followModel
      .findOne({
        followingId: followDto.followingId,
        followerId: followDto.followerId,
      })
      .exec();
    return !!follow;
  }

  private async checkIfAlreadyFollowing(followDto: FollowDto): Promise<void> {
    const alreadyFollowing = await this.isFollowed(followDto);
    if (alreadyFollowing) {
      throw new BadRequestException('You are already following this user');
    }
  }

  private prepareFollowDto(followDto: FollowDto, profile: Profile): FollowDto {
    if (!profile.isPrivate) {
      followDto.accepted = true;
    }
    followDto.followingId = profile.user;
    return followDto;
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

  createFollowNotification(followDto: FollowDto) {
    const notificationDto: NotificationDto = {
      user: followDto.followingId,
      from: followDto.followerId,
      type: 'follow',
    };
    this.eventEmitter.emit('notification.create', notificationDto);
  }
}
