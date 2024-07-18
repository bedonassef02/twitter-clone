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
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { rateLimit } from './utils/helpers/rate-limit.helper';
import { APP_GUARD } from '@nestjs/core';
import { BillingModule } from './billing/billing.module';
import { AccountModule } from './account/account.module';
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
      ttl: 6000,
      isGlobal: true,
    }),
    ThrottlerModule.forRoot(rateLimit),
    BillingModule,
    AccountModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
