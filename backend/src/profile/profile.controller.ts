import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiBearerAuth, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ProfileGuard } from './guards/profile.guard';
import { BlockGuard } from '../block/block.guard';
import { ProfileResponse } from './dto/responses/profile.response';
import { ProfileCountResponse } from './dto/responses/profile-count.response';
import { LikeDocument } from '../likes/entities/like.entity';
import { LikeResponse } from '../likes/dto/responses/like.response';
import { PostResponse } from '../posts/dto/responses/post.response';
import { FollowResponse } from '../follow/dto/responses/follow.response';
import { CacheInterceptor } from '@nestjs/cache-manager';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
@UseInterceptors(CacheInterceptor)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username')
  @ApiOkResponse({
    type: ProfileResponse,
  })
  findOne(@Param('username') username: string) {
    return this.profileService.findByUsername(username);
  }

  @Get(':username/count')
  @ApiOkResponse({
    type: ProfileCountResponse,
  })
  findCount(@Param('username') username: string) {
    return this.profileService.count(username);
  }
  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username/likes')
  @ApiOkResponse({
    type: LikeResponse,
    isArray: true,
  })
  findLikes(@Param('username') username: string): Promise<LikeDocument[]> {
    return this.profileService.findLikes(username);
  }

  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username/posts')
  @ApiOkResponse({
    type: PostResponse,
    isArray: true,
  })
  findPosts(@Param('username') username: string) {
    return this.profileService.findPosts(username);
  }

  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username/following')
  @ApiOkResponse({
    type: FollowResponse,
    isArray: true,
  })
  findFollowing(@Param('username') username: string) {
    return this.profileService.findFollowing(username);
  }

  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username/followers')
  @ApiOkResponse({
    type: FollowResponse,
    isArray: true,
  })
  findFollowers(@Param('username') username: string) {
    return this.profileService.findFollowers(username);
  }

  @Patch()
  @ApiOkResponse({
    type: ProfileResponse,
  })
  update(@User('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }
}
