import { Injectable } from '@nestjs/common';
import { CreateFollowDto } from './dto/create-follow.dto';
import { ProfileService } from "../profile/profile.service";
@Injectable()
export class FollowService {
  constructor(private readonly profileService:ProfileService) {
  }
  create(createFollowDto: CreateFollowDto) {
    return 'This action adds a new follow';
  }

  findAll() {
    return `This action returns all follow`;
  }

  findOne(id: number) {
    return `This action returns a #${id} follow`;
  }

  remove(id: number) {
    return `This action removes a #${id} follow`;
  }
}
