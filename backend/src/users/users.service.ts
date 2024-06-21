import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './entities/user.entity';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user: UserDocument = await this.userModel.findByIdAndUpdate(
      id,
      updateUserDto,
      {
        new: true,
        timestamps: false,
      },
    );
    return {
      id: user.id,
      name: user.name,
      username: user.username,
    };
  }
  async search(keyword: string): Promise<UserDocument[]> {
    const regex = new RegExp(keyword, 'i');
    return this.userModel
      .find({
        $or: [{ name: { $regex: regex } }, { username: { $regex: regex } }],
      })
      .exec();
  }
  setTwoFactorAuthenticationStatus(
    id: string,
    isTwoFactorAuthenticated: boolean,
  ) {
    return this.userModel.findByIdAndUpdate(
      id,
      { isTwoFactorAuthenticated },
      { new: true },
    );
  }
}
