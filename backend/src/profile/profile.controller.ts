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
    return this.profileService.findOne(username);
  }

  @Get(':username/likes')
  findOneLikes(@Param('username') username: string) {
    return this.profileService.findOneLikes(username);
  }

  @Get(':username/posts')
  findOnePosts(@Param('username') username: string) {
    return this.profileService.findOnePosts(username);
  }

  @Patch('')
  update(@User('id') id: string, @Body() updateProfileDto: UpdateProfileDto) {
    return this.profileService.update(id, updateProfileDto);
  }
}
