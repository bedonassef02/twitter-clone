import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { UsersService } from '../../../../users/users.service';
import { AuthService } from '../../../auth.service';
import { AuthResponse } from '../../../dto/responses/auth.response';

@Injectable()
export class GoogleAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly authService: AuthService,
  ) {}
  async getNewAccessToken(refreshToken: string): Promise<string> {
    try {
      const response = await axios.post(
        'https://accounts.google.com/o/oauth2/token',
        {
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          refresh_token: refreshToken,
          grant_type: 'refresh_token',
        },
      );

      return response.data.access_token;
    } catch (error) {
      throw new Error('Failed to refresh the access token.');
    }
  }

  async getProfile(token: string) {
    try {
      return axios.get(
        `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }

  async loginOrRegister(googleToken: string): Promise<AuthResponse> {
    const user = (await this.getProfile(googleToken)).data;
    let isUserExist = await this.usersService.findByGoogleId(user.id);
    if (!isUserExist) {
      isUserExist = await this.usersService.create({
        googleId: user.id,
        name: user.name,
        username: user.email.split('@')[0],
      });
    }
    return this.authService.createResponse(isUserExist);
  }

  async isTokenExpired(token: string): Promise<boolean> {
    try {
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v1/tokeninfo?access_token=${token}`,
      );

      const expiresIn = response.data.expires_in;

      if (!expiresIn || expiresIn <= 0) {
        return true;
      }
    } catch (error) {
      return true;
    }
  }

  async revokeGoogleToken(token: string) {
    try {
      await axios.get(
        `https://accounts.google.com/o/oauth2/revoke?token=${token}`,
      );
    } catch (error) {
      console.error('Failed to revoke the token:', error);
    }
  }
}
