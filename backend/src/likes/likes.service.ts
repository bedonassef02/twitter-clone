import { Injectable } from '@nestjs/common';
import { LikeDto } from './dto/like.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument } from './entities/like.entity';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private readonly likeModel: Model<LikeDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async toggle(likeDto: LikeDto) {
    const isLikeExist = await this.findOne(likeDto);
    if (!isLikeExist) {
      const createNotificationDto: CreateNotificationDto = {
        post: likeDto.post,
        from: likeDto.user,
        type: 'like',
        user: likeDto.user,
      };
      this.eventEmitter.emit('notification.create', createNotificationDto);
      return this.create(likeDto);
    }
    await this.remove(isLikeExist.id);
  }

  findAll(post: string) {
    return this.likeModel.find({ post }).limit(100);
  }

  findUserLikes(user: string) {
    return this.likeModel.find({ user });
  }

  findOne(likeDto: LikeDto): Promise<LikeDocument | null> {
    return this.likeModel.findOne({ user: likeDto.user, post: likeDto.post });
  }

  private create(likeDto: LikeDto): Promise<LikeDocument> {
    return this.likeModel.create(likeDto);
  }

  private remove(id: string): Promise<LikeDocument | null> {
    return this.likeModel.findByIdAndDelete(id);
  }

  async countUserLikes(user: string): Promise<number> {
    return this.likeModel.countDocuments({ user }).exec();
  }

  async countPostLikes(post: string): Promise<number> {
    return this.likeModel.countDocuments({ post }).exec();
  }
}
