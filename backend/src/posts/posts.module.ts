import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { PostsService } from './posts.service';
import { PostsController } from './posts.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostSchema } from './entities/post.entity';
import { AuthMiddleware } from '../auth/middlewares/auth.middleware';
import { IsUserUpdatedMiddleware } from '../auth/middlewares/is-user-updated.middleware';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { MulterModule } from '@nestjs/platform-express';
import { ProfileModule } from '../profile/profile.module';
import { FollowModule } from '../follow/follow.module';
import { GuardService } from './services/guard.service';
import { LikesModule } from '../likes/likes.module';
import { PostsStatusService } from './utils/services/posts-status.service';
import { multerHelper } from './utils/helpers/multer.helper';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }]),
    MulterModule.register(multerHelper),
    AuthModule,
    UsersModule,
    LikesModule,
    forwardRef(() => ProfileModule),
    FollowModule,
  ],
  controllers: [PostsController],
  providers: [PostsService, PostsStatusService, GuardService],
  exports: [PostsService, PostsStatusService, GuardService],
})
export class PostsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware, IsUserUpdatedMiddleware)
      .forRoutes(PostsController);
  }
}
