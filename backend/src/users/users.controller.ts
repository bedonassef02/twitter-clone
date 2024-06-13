import { Controller, Get, Param } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ProfileService } from '../profile/profile.service';
import { UsersService } from './users.service';
import { UserDocument } from './entities/user.entity';
import { Profile } from '../profile/entities/profile.entity';
@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly profileService: ProfileService,
  ) {}
  @Get(':id')
  async findOne(@Param('id') id: string) {
    const user: UserDocument = await this.usersService.findById(id);
    const profile: Profile = await this.profileService.findByUserId(id);
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      image: profile.profileImage,
      isPrivate: profile.isPrivate,
    };
  }
}
