import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfileGuard } from './guards/profile.guard';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @UseGuards(ProfileGuard)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.profileService.findProfileByUsername(username);
  }

  @Get(':username/count')
  count(@Param('username') username: string) {
    return this.profileService.count(username);
  }
  @UseGuards(ProfileGuard)
  @Get(':username/likes')
  getUserLikes(@Param('username') username: string) {
    return this.profileService.getUserLikes(username);
  }

  @UseGuards(ProfileGuard)
  @Get(':username/posts')
  getUserPosts(@Param('username') username: string) {
    return this.profileService.getUserPosts(username);
  }

  @UseGuards(ProfileGuard)
  @Get(':username/following')
  getUserFollowing(@Param('username') username: string) {
    return this.profileService.getUserFollowing(username);
  }

  @UseGuards(ProfileGuard)
  @Get(':username/followers')
  getUserFollowers(@Param('username') username: string) {
    return this.profileService.getUserFollowers(username);
  }

  @Patch()
  update(@User('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }
}
