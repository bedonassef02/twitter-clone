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

  async create(createPostDto: CreatePostDto): Promise<any> {
    checkIfPostEmpty(createPostDto);
    checkPostType(createPostDto);
    if (createPostDto.type === 'comment' || createPostDto.repost) {
      const createNotificationDto: NotificationDto =
        createPostNotification(createPostDto);
      this.eventEmitter.emit('notification.create', createNotificationDto);
    }
    const post = await this.postModel.create(createPostDto);
    return {
      post,
      comments: 0,
      reposts: 0,
      likes: 0,
    };
  }

  findAll() {
    return this.postModel.find().sort({ createdAt: -1 });
  }

  async findUserPosts(user: string): Promise<any[]> {
    const posts: PostDocument[] = await this.postModel.find({ user }).sort({ createdAt: -1 });

    return await Promise.all(
      posts.map(async (post) => {
        const info = await this.findCount(post.id);
        return { post, ...info };
      }),
    );
  }

  async findOne(id: string): Promise<any> {
    const post: PostDocument | null = await this.postModel.findById(id);
    if (!post) {
      throw new NotFoundException(`post with id: ${id} not found`);
    }
    const info = await this.findCount(id);
    return { post, ...info };
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
    const post: any = await this.findOne(id);
    if (post.user.toString() !== userId) {
      throw new UnauthorizedException(
        'you are not allowed to remove this post',
      );
    }
    await this.postModel.findByIdAndDelete(id);
  }

  async search(keyword: string): Promise<any[]> {
    const regex = new RegExp(keyword, 'i');
    const posts: PostDocument[] = await this.postModel
      .find({
        $or: [{ content: { $regex: regex } }],
      })
      .exec();

    return await Promise.all(
      posts.map(async (post) => {
        const info = await this.findCount(post.id);
        return { post, ...info };
      }),
    );
  }
}
