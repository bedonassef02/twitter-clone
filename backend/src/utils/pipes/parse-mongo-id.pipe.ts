import { Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';
import { isValidMongoId } from '../helpers/is-valid-mongo-id.helper';

@Injectable()
export class ParseMongoIdPipe implements PipeTransform {
  transform(value: string): Types.ObjectId | string {
    isValidMongoId(value);

    return Types.ObjectId.createFromHexString(value);
  }
}
