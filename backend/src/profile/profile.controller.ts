import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { User } from '../users/utils/decorators/user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfileGuard } from './guards/profile.guard';
import { ProfileStatusService } from './services/profile-status.service';
import { BlockGuard } from '../block/block.guard';

@ApiTags('Profile')
@ApiBearerAuth()
@Controller('profile')
export class ProfileController {
  constructor(
    private readonly profileService: ProfileService,
    private readonly profileStatusService: ProfileStatusService,
  ) {}
  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username')
  findOne(@Param('username') username: string) {
    return this.profileService.findByUsername(username);
  }

  @Get(':username/count')
  findCount(@Param('username') username: string) {
    return this.profileStatusService.count(username);
  }
  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username/likes')
  findLikes(@Param('username') username: string) {
    return this.profileService.findLikes(username);
  }

  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username/posts')
  findPosts(@Param('username') username: string) {
    return this.profileService.findPosts(username);
  }

  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username/following')
  findFollowing(@Param('username') username: string) {
    return this.profileService.findFollowing(username);
  }

  @UseGuards(ProfileGuard, BlockGuard)
  @Get(':username/followers')
  findFollowers(@Param('username') username: string) {
    return this.profileService.findFollowers(username);
  }

  @Patch()
  update(@User('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }
}
