import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const user: UserDocument = await this.userModel.create(createUserDto);
    this.eventEmitter.emit('profile.create', { user: user.id });
    return user;
  }

  findOne(username: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ username });
  }

  findByGoogleId(googleId: string): Promise<UserDocument | null> {
    return this.userModel.findOne({ googleId });
  }

  findById(id: string): Promise<UserDocument | null> {
    return this.userModel.findById(id);
  }
}
