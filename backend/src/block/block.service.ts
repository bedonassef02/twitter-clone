import { BadRequestException, Injectable } from '@nestjs/common';
import { BlockDto } from './dto/block.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Block, BlockDocument } from './entities/block.entity';
import { Model } from 'mongoose';

@Injectable()
export class BlockService {
  constructor(
    @InjectModel(Block.name) private readonly blockModel: Model<BlockDocument>,
  ) {}
  async create(blockDto: BlockDto) {
    if (blockDto.blockedUserId === blockDto.userId) {
      throw new BadRequestException('you cannot block yourself');
    }
    if (await this.findOne(blockDto)) {
      throw new BadRequestException('you already blocked this user');
    }
    return this.blockModel.create(blockDto);
  }

  findAll(userId: string) {
    return this.blockModel.find({ userId });
  }

  findOne(blockDto: BlockDto) {
    return this.blockModel.findOne(blockDto);
  }

  remove(id: string) {
    return this.blockModel.findByIdAndDelete(id);
  }
}
