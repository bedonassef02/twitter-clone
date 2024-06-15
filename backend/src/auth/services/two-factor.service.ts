import { Injectable } from '@nestjs/common';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import { InjectModel } from '@nestjs/mongoose';
import { SecretKey } from '../entities/secret-key.entity';
import { Model } from 'mongoose';

@Injectable()
export class TwoFactorService {
  constructor(
    @InjectModel(SecretKey.name)
    private readonly secretKeyModel: Model<SecretKey>,
  ) {}
  generate2FASecret(userEmail: string) {
    return speakeasy.generateSecret({
      length: 20,
      name: `Twitter-Clone (${userEmail})`,
      issuer: 'Twitter-Clone',
    });
  }

  async generateQRCode(secret: string) {
    const otpauth = speakeasy.otpauthURL({
      secret: secret,
      label: 'MyApp',
      issuer: 'MyApp',
      encoding: 'base32',
    });

    return qrcode.toDataURL(otpauth);
  }

  verify2FAToken(token: string, secret: string) {
    return speakeasy.totp.verify({
      secret: secret,
      encoding: 'base32',
      token: token,
    });
  }

  async updateTwoFactorSecret(user: string, secret: string) {
    const isExist = await this.secretKeyModel.findOneAndUpdate(
      { user },
      { secret },
      { new: true },
    );
    if (!isExist) {
      return this.secretKeyModel.create({ secret, user });
    }
    return isExist;
  }

  getUserTwoFactorSecret(user: string) {
    return this.secretKeyModel.findOne({ user });
  }
}
