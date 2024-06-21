import { Types } from 'mongoose';
import { BadRequestException } from '@nestjs/common';

export function isValidMongoId(value: string): boolean {
  if (!value || !Types.ObjectId.isValid(value)) {
    throw new BadRequestException('Invalid Mongo Id format');
  }
  return true;
}
