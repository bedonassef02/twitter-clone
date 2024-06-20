import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './entities/post.entity';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { NotificationDto } from '../notifications/dto/notification.dto';
import { LikesService } from '../likes/likes.service';
import {
  checkIfPostEmpty,
  checkPostType,
  createPostNotification,
} from './utils/helpers/create-post.helper';
import { PostsStatusService } from './utils/services/posts-status.service';
import { PostCountResponse } from './dto/responses/post-count.response';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly likesService: LikesService,
    private readonly postsStatusService: PostsStatusService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  create(createPostDto: CreatePostDto): Promise<PostDocument> {
    checkIfPostEmpty(createPostDto);
    checkPostType(createPostDto);
    if (createPostDto.type === 'comment' || createPostDto.repost) {
      const createNotificationDto: NotificationDto =
        createPostNotification(createPostDto);
      this.eventEmitter.emit('notification.create', createNotificationDto);
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

  async findCount(id: string): Promise<PostCountResponse> {
    const [likes, comments, reposts] = await Promise.all([
      this.likesService.countPostLikes(id),
      this.postsStatusService.countPostComments(id),
      this.postsStatusService.countReposts(id),
    ]);
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
}
