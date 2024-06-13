import {
  forwardRef,
  MiddlewareConsumer,
  Module,
  NestModule,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Profile, ProfileSchema } from './entities/profile.entity';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { LikesModule } from '../likes/likes.module';
import { PostsModule } from '../posts/posts.module';
import { AuthMiddleware } from '../auth/middlewares/auth.middleware';
import { IsUserUpdatedMiddleware } from '../auth/middlewares/is-user-updated.middleware';
import { FollowModule } from '../follow/follow.module';
import { ProfileStatusService } from './services/profile-status.service';
import {BlockModule} from "../block/block.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Profile.name, schema: ProfileSchema }]),
    AuthModule,
    UsersModule,
    LikesModule,
    forwardRef(() => PostsModule),
    FollowModule,
    BlockModule
  ],
  controllers: [ProfileController],
  providers: [ProfileService, ProfileStatusService],
  exports: [ProfileService],
})
export class ProfileModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware, IsUserUpdatedMiddleware)
      .forRoutes(ProfileController);
  }
}
