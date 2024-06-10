import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UsersService } from '../../../users/users.service';
import { UserDocument } from '../../../users/entities/user.entity';

@ValidatorConstraint({ name: 'IsUnique', async: true })
@Injectable()
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly usersService: UsersService) {}

  async validate(value: any): Promise<boolean> {
    return this.isUnique(value);
  }

  defaultMessage(): string {
    return 'This username is already in use.';
  }

  private async isUnique(username: string): Promise<boolean> {
    const usernameExists: UserDocument | undefined =
      await this.usersService.findOne(username);
    return !usernameExists;
  }
}
