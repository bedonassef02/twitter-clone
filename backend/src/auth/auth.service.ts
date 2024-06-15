import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from './services/password.service';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from '../users/entities/user.entity';
import { createPayload } from './utils/helpers/create-payload.helper';
import { Payload } from './utils/interfaces/payload.interface';
import { TokenService } from './services/token.service';
import { authResponse } from './utils/helpers/auth-response.helper';
import { AuthResponse } from './dto/responses/auth.response';
import { TwoFactorService } from './services/two-factor.service';
import { SecretKey } from './entities/secret-key.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
    private readonly twoFactorService: TwoFactorService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    registerDto.password = await this.passwordService.hash(
      registerDto.password,
    );
    const user: UserDocument = await this.usersService.create(registerDto);
    return this.createResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user: UserDocument = await this.usersService.findOne(
      loginDto.username,
    );
    await this.checkPassword(user, loginDto);
    return this.createResponse(user);
  }

  async createResponse(user: UserDocument, isPassed2FA:boolean=false): Promise<AuthResponse> {
    const payload: Payload = createPayload(user, isPassed2FA);
    const token = await this.tokenService.generate(payload);
    return authResponse(payload, token);
  }

  private async checkPassword(user: UserDocument, loginDto: LoginDto) {
    if (
      !user ||
      !(await this.passwordService.compare(loginDto.password, user.password))
    ) {
      throw new BadRequestException(
        'username or password does not match our records',
      );
    }
  }

  async generate2FASecret(id: string) {
    const secret = this.twoFactorService.generate2FASecret(id);
    await this.twoFactorService.updateTwoFactorSecret(id, secret.base32);
    return secret;
  }

  async generateQRCode(secret: string) {
    return await this.twoFactorService.generateQRCode(secret);
  }

  verify2FAToken(token: string, secret: string) {
    return this.twoFactorService.verify2FAToken(token, secret);
  }

  setTwoFactorAuthenticationStatus(id: string, enable: boolean) {
    return this.usersService.setTwoFactorAuthenticationStatus(id, enable);
  }

  async getUserTwoFactorSecret(id: string): Promise<string> {
    const secretKey: SecretKey =
      await this.twoFactorService.getUserTwoFactorSecret(id);
    return secretKey.secret;
  }
}
