import { Injectable } from '@nestjs/common';
import { ChatDto } from './dto/chat.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Chat, ChatDocument } from './entities/chat.entity';
import { Model } from 'mongoose';
import { ObjectId } from 'mongodb';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(Chat.name) private readonly chatModel: Model<ChatDocument>,
  ) {}

  create(chatDto: ChatDto): Promise<ChatDocument> {
    return this.chatModel.create(chatDto);
  }

  async findAll(user: string): Promise<ChatDocument[]> {
    const userId = new ObjectId(user);

    return this.chatModel
      .aggregate([
        {
          $match: {
            $or: [{ senderId: userId }, { receiverId: userId }],
          },
        },
        {
          $sort: {
            timestamp: -1,
          },
        },
        {
          $group: {
            _id: {
              $cond: [
                { $gt: ['$senderId', '$receiverId'] },
                { sender: '$senderId', receiver: '$receiverId' },
                { sender: '$receiverId', receiver: '$senderId' },
              ],
            },
            lastMessage: { $first: '$$ROOT' },
          },
        },
        {
          $replaceRoot: { newRoot: '$lastMessage' },
        },
      ])
      .exec();
  }

  async findOne(
    firstUser: string,
    secondUser: string,
  ): Promise<ChatDocument[]> {
    return this.chatModel
      .find({
        $or: [
          { senderId: firstUser, receiverId: secondUser },
          { senderId: secondUser, receiverId: firstUser },
        ],
      })
      .sort({ timestamp: 1 })
      .exec();
  }
  clear(user: string, id: string): Promise<any> {
    return this.chatModel.deleteMany({
      $or: [
        { senderId: user, receiverId: id },
        { senderId: id, receiverId: user },
      ],
    });
  }

  async remove(id: string): Promise<void> {
    await this.chatModel.findByIdAndDelete(id);
  }
}
