export class CreateUserDto {
  id?: string;
  name: string;
  username: string;
  password?: string;
  googleId?: string;
  twoFactorSecret?: string;
  isTwoFactorAuthenticated?: boolean;
}
