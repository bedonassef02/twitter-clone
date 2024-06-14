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
  async create(blockDto: BlockDto): Promise<BlockDocument> {
    this.isSameUser(blockDto);
    await this.isBlockedBefore(blockDto);
    return this.blockModel.create(blockDto);
  }

  findAll(userId: string): Promise<BlockDocument[]> {
    return this.blockModel.find({ userId });
  }

  findOne(blockDto: BlockDto): Promise<BlockDocument> {
    return this.blockModel.findOne(blockDto);
  }

  remove(id: string) {
    return this.blockModel.findByIdAndDelete(id);
  }

  private isSameUser(blockDto: BlockDto) {
    if (blockDto.blockedUserId === blockDto.userId) {
      throw new BadRequestException('you cannot block yourself');
    }
  }

  private async isBlockedBefore(blockDto: BlockDto) {
    if (await this.findOne(blockDto)) {
      throw new BadRequestException('you already blocked this user');
    }
  }
}
