import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.profileService.findProfileByUsername(username);
  }

  @Get(':username/likes')
  getUserLikes(@Param('username') username: string) {
    return this.profileService.getUserLikes(username);
  }

  @Get(':username/posts')
  getUserPosts(@Param('username') username: string) {
    return this.profileService.getUserPosts(username);
  }

  @Get(':username/following')
  getUserFollowing(@Param('username') username: string) {
    return this.profileService.getUserFollowing(username);
  }

  @Get(':username/followers')
  getUserFollowers(@Param('username') username: string) {
    return this.profileService.getUserFollowers(username);
  }

  @Patch('')
  update(@User('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }
}
