import {
  Controller,
  Get,
  UseGuards,
  Request,
  Res,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GoogleAuthService } from '../services/google-auth.service';
import { CheckTokenExpiryGuard } from '../guards/check-token-expiry.guard';
import { ApiTags } from '@nestjs/swagger';
import {UsersService} from "../../../../users/users.service";
import {AuthService} from "../../../auth.service";

@ApiTags('Google Auth')
@Controller('auth')
export class GoogleAuthController {
  constructor(
      private readonly googleAuthService: GoogleAuthService,
      private readonly usersService: UsersService,
      private readonly authService: AuthService,
              ) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Request() req, @Res() res: Response) {
    const googleToken = req.user.accessToken;
    const googleRefreshToken = req.user.refreshToken;

    res.cookie('access_token', googleToken, { httpOnly: true });
    res.cookie('refresh_token', googleRefreshToken, {
      httpOnly: true,
    });

    await this.googleAuthService.loginOrRegister(googleToken);

    res.redirect('https://twitter-api-ld6h.onrender.com/auth/profile');
  }

  @UseGuards(CheckTokenExpiryGuard)
  @Get('profile')
  async getProfile(@Request() req) {
    const accessToken = req.cookies['access_token'];
    if (accessToken) {
      const userData =  (await this.googleAuthService.getProfile(accessToken)).data;
      const user = await this.usersService.findByGoogleId(userData.id);
      return this.authService.createResponse(user);
    }
    throw new UnauthorizedException('No access token');
  }

  @Get('logout')
  logout(@Req() req, @Res() res: Response) {
    const refreshToken = req.cookies['refresh_token'];
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    this.googleAuthService.revokeGoogleToken(refreshToken);
    res.redirect('http://localhost:3000/');
  }
}
