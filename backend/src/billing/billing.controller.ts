import { Controller, Post, Body, Get } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';
import { User } from '../users/utils/decorators/user.decorator';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('verify')
  async verify(@User('id') user: string) {
    return await this.billingService.createAccountVerificationSession(user);
  }

  @Get('success')
  success(@User('id') user: string) {
    return this.billingService.success(user);
  }
}
