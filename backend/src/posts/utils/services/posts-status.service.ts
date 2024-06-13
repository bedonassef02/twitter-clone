import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../../entities/post.entity';
import { LikesService } from '../../../likes/likes.service';

@Injectable()
export class PostsStatusService {
  constructor(
    @InjectModel(Post.name) private readonly postModel: Model<PostDocument>,
    private readonly likesService: LikesService,
  ) {}

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

  async countUserPosts(userId: string): Promise<number> {
    return this.postModel.countDocuments({ user: userId }).exec();
  }

  async countUserMedia(userId: string): Promise<number> {
    return this.postModel
      .countDocuments({ user: userId, images: { $ne: null } })
      .exec();
  }
  async countPostComments(postId: string): Promise<number> {
    return this.postModel
      .countDocuments({ repost: postId, type: 'comment' })
      .exec();
  }

  async countReposts(postId: string): Promise<number> {
    return this.postModel
      .countDocuments({ repost: postId, type: 'repost' })
      .exec();
  }
}
