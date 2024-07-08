import { Controller, Post, Body, Get } from '@nestjs/common';
import { BillingService } from './billing.service';
import { CreateBillingDto } from './dto/create-billing.dto';

@Controller('billing')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Post('subscribe')
  async subscribe(@Body() billingDto: CreateBillingDto) {
    const subscription = await this.billingService.verify(billingDto);
    return subscription;
  }
}
