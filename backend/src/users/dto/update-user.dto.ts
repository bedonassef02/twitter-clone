import { IsOptional, IsString, Length, Matches } from 'class-validator';
import { IsUnique } from '../../auth/utils/decorators/is-unique.decorator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name: string;
  @IsOptional()
  @IsString()
  @Length(3, 20)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username can only contain letters, numbers, and underscores',
  })
  @IsUnique()
  username: string;
}
