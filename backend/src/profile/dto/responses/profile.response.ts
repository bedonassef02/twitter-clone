import { ApiProperty } from '@nestjs/swagger';

export class ProfileResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  profileImage: string;
  @ApiProperty()
  coverImage: string;
  @ApiProperty()
  bio: string;
  @ApiProperty()
  birthDate: Date;
  @ApiProperty()
  location: string;
  @ApiProperty()
  website: string;
  @ApiProperty()
  isPrivate: boolean;
  @ApiProperty()
  user: string;
  @ApiProperty()
  createdAt: Date;
}
