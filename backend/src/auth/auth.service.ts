import { BadRequestException, Injectable } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UsersService } from '../users/users.service';
import { PasswordService } from './services/password.service';
import { LoginDto } from './dto/login.dto';
import { UserDocument } from '../users/entities/user.entity';
import { createPayload } from './utils/helpers/create-payload.helper';
import { Payload } from './utils/interfaces/payload.interface';
import { TokenService } from './services/token.service';
import { authResponse } from './utils/helpers/auth-response.helper';
import { AuthResponse } from './utils/interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
    private readonly tokenService: TokenService,
  ) {}

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    registerDto.password = await this.passwordService.hash(
      registerDto.password,
    );
    const user: UserDocument = await this.usersService.create(registerDto);
    return this.createResponse(user);
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const user = await this.usersService.findOne(loginDto.username);
    if (
      !user ||
      !(await this.passwordService.compare(loginDto.password, user.password))
    ) {
      throw new BadRequestException(
        'username or password does not match our records',
      );
    }
    return this.createResponse(user);
  }

  async createResponse(user: UserDocument): Promise<AuthResponse> {
    const payload: Payload = createPayload(user);
    const token = await this.tokenService.generate(payload);
    return authResponse(payload, token);
  }
}
