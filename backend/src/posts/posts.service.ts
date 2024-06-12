import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CreateNotificationDto } from '../notifications/dto/create-notification.dto';
import { LikesService } from '../likes/likes.service';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly likesService: LikesService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(createPostDto: CreatePostDto) {
    if (
      !createPostDto.content &&
      !createPostDto.images &&
      !createPostDto.repost
    ) {
      throw new BadRequestException("you can't create empty post");
    }
    if (createPostDto.type === 'comment' || createPostDto.repost) {
      const createNotificationDto: CreateNotificationDto = {
        post: createPostDto.repost,
        from: createPostDto.user,
        type: createPostDto.type || 'repost',
        user: createPostDto.user,
      };
      this.eventEmitter.emit('notification.create', createNotificationDto);
    }
    if (createPostDto.repost && createPostDto.type !== 'comment') {
      createPostDto.type = 'repost';
    }
    return this.postModel.create(createPostDto);
  }

  findAll() {
    return `This action returns all posts`;
  }

  findUserPosts(user: string) {
    return this.postModel.find({ user });
  }

  async findOne(id: string): Promise<PostDocument | null> {
    const post: PostDocument | null = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException(`post with id: ${id} not found`);
    }
    return post;
  }

  async findCount(id: string): Promise<any> {
    const likes = await this.likesService.countPostLikes(id);
    const comments = await this.countPostComments(id);
    const reposts = await this.countReposts(id);
    return {
      comments,
      reposts,
      likes,
    };
  }
  async remove(userId: string, id: string): Promise<void> {
    const post: Post = await this.findOne(id);
    if (post.user.toString() !== userId) {
      throw new UnauthorizedException(
        'you are not allowed to remove this post',
      );
    }
    await this.postModel.findByIdAndDelete(id);
  }

  async search(keyword: string): Promise<PostDocument[]> {
    const regex = new RegExp(keyword, 'i');
    return this.postModel
      .find({
        $or: [{ content: { $regex: regex } }],
      })
      .exec();
  }

  async countUserPosts(userId: string): Promise<number> {
    return this.postModel.countDocuments({ user: userId }).exec();
  }

  async countUserMedia(userId: string): Promise<number> {
    return this.postModel
      .countDocuments({ user: userId, images: { $ne: null } })
      .exec();
  }
  private async countPostComments(postId: string): Promise<number> {
    return this.postModel
      .countDocuments({ repost: postId, type: 'comment' })
      .exec();
  }

  private async countReposts(postId: string): Promise<number> {
    return this.postModel
      .countDocuments({ repost: postId, type: 'repost' })
      .exec();
  }
}
