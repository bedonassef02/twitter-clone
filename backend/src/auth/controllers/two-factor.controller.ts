import { Body, Controller, Get, Post } from '@nestjs/common';
import { User } from '../../users/utils/decorators/user.decorator';
import { AuthService } from '../auth.service';
import { UserDocument } from '../../users/entities/user.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('2FA')
@ApiBearerAuth()
@Controller('auth')
export class TwoFactorController {
  constructor(private readonly authService: AuthService) {}
  @Get('generate-2fa')
  async generate2FA(@User('id') id: string) {
    const secret = await this.authService.generate2FASecret(id);
    const qrCode = await this.authService.generateQRCode(secret.base32);

    return { secret: secret.base32, qrCode };
  }

  @Post('verify-2fa')
  async verify2FA(@User('id') id: string, @Body('otp') otp: string) {
    const twoFactorSecret: string =
      await this.authService.getUserTwoFactorSecret(id);
    const isVerified = this.authService.verify2FAToken(otp, twoFactorSecret);

    if (isVerified) {
      const user: UserDocument =
        await this.authService.setTwoFactorAuthenticationStatus(id, true);
      return this.authService.createResponse(user, true);
    } else {
      return { message: 'Invalid 2FA OTP' };
    }
  }
}
