import { ApiProperty } from '@nestjs/swagger';

export class AuthResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  username: string;
  @ApiProperty()
  access_token: string;
  @ApiProperty()
  isTwoFactorAuthenticated: boolean;
  @ApiProperty()
  isPassed2FA: boolean;
}
