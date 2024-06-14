import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostsModule } from './posts/posts.module';
import { DatabaseModule } from './database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { LikesModule } from './likes/likes.module';
import { ProfileModule } from './profile/profile.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { NotificationsModule } from './notifications/notifications.module';
import { FollowModule } from './follow/follow.module';
import { BlockModule } from './block/block.module';
import { ChatModule } from './chat/chat.module';
import { SearchModule } from './search/search.module';
import { BookmarksModule } from './bookmarks/bookmarks.module';
import { CacheModule } from '@nestjs/cache-manager';
@Module({
  imports: [
    ConfigModule.forRoot({ expandVariables: true, isGlobal: true }),
    EventEmitterModule.forRoot(),
    PostsModule,
    DatabaseModule,
    UsersModule,
    AuthModule,
    LikesModule,
    ProfileModule,
    NotificationsModule,
    FollowModule,
    BlockModule,
    ChatModule,
    SearchModule,
    BookmarksModule,
    CacheModule.register({
      max: 10,
      ttl: 600000,
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
