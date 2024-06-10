import { Module } from '@nestjs/common';
import { FollowService } from './follow.service';
import { FollowController } from './follow.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Follow, FollowSchema } from './entities/follow.entity';
import { AuthModule } from "../auth/auth.module";
import { UsersModule } from "../users/users.module";
import { ProfileModule } from "../profile/profile.module";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Follow.name, schema: FollowSchema }]),
    AuthModule,
    ProfileModule,
    UsersModule,
  ],
  controllers: [FollowController],
  providers: [FollowService],
})
export class FollowModule {}
