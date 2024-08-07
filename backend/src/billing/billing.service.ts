import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { InjectModel } from '@nestjs/mongoose';
import { Billing } from './entities/billing.entity';
import { Model } from 'mongoose';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UpdateProfileDto } from '../profile/dto/update-profile.dto';

@Injectable()
export class BillingService {
  private readonly stripe: Stripe;

  constructor(
    @InjectModel(Billing.name) private readonly billingModel: Model<Billing>,
    private readonly eventEmitter: EventEmitter2,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  }

  async createAccountVerificationSession(
    user: string,
  ): Promise<Stripe.Response<Stripe.Checkout.Session>> {
    const lineItems = this.getAccountVerificationLineItems();

    return this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      success_url: `${process.env.APP_URL}/billing/success?user=${user}`, // TODO: TOKEN
      cancel_url: `${process.env.APP_URL}/billing/cancel`,
    });
  }

  success(user: string): Promise<Billing> {
    const profileDto: UpdateProfileDto = {
      isVerified: true,
      verifiedAt: new Date(),
    };
    this.eventEmitter.emit('profile.update', user, profileDto);
    return this.billingModel.create({ user });
  }

  private getAccountVerificationLineItems(): Stripe.Checkout.SessionCreateParams.LineItem[] {
    return [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Account Verification for 1 Month',
            images: [],
          },
          unit_amount: 800, // 8 USD in cents
        },
        quantity: 1,
      },
    ];
  }
}
