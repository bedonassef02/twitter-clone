import { Body, Controller, Get, Param, Patch, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { UserDocument } from './entities/user.entity';
import { ParseMongoIdPipe } from '../utils/pipes/parse-mongo-id.pipe';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './utils/decorators/user.decorator';
import { Payload } from '../auth/utils/interfaces/payload.interface';

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  @Get(':id')
  @UsePipes(ParseMongoIdPipe)
  async findOne(@Param('id') id: string) {
    const user: UserDocument = await this.usersService.findById(id);
    const profile: any = (
      await this.eventEmitter.emitAsync('profile.findOne', id)
    )[0];
    return {
      id: user.id,
      name: user.name,
      username: user.username,
      image: profile.profileImage,
      isPrivate: profile.isPrivate,
      profileImage: profile.profileImage,
      coverImage: profile.coverImage,
      bio: profile.bio,
      birthDate: profile.birthDate,
      location: profile.location,
      website: profile.website,
    };
  }

  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: Payload) {
    return this.usersService.update(user.id, updateUserDto);
  }
}
