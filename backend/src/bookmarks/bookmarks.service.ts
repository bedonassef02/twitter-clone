import { Injectable } from '@nestjs/common';
import { BookmarkDto } from './dto/bookmark.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Bookmark, BookmarkDocument } from './entities/bookmark.entity';
import { Model } from 'mongoose';

@Injectable()
export class BookmarksService {
  constructor(
    @InjectModel(Bookmark.name)
    private readonly bookmarkModel: Model<BookmarkDocument>,
  ) {}
  create(bookmarkDto: BookmarkDto) {
    return this.bookmarkModel.create(bookmarkDto);
  }

  findAll(user: string) {
    return this.bookmarkModel.find({ user });
  }

  remove(id: string) {
    return this.bookmarkModel.findByIdAndDelete(id);
  }
}
