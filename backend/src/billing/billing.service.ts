import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CreateBillingDto } from './dto/create-billing.dto';

const stripe = new Stripe(
  'sk_test_51NgF3oIl4KnoeBCgAxl1nPqFX21xg5zLu3mJxGOORbVzH0bF01eF2dgjR5w8GC41wdx2flTfNXuhCbVges67BnwU00QFE5VI8p',
);

@Injectable()
export class BillingService {
  async verify(billingDto: CreateBillingDto) {
    const customer = await this.createCustomer('email', 'paymentMethodId');
    // Step 2: Create a subscription
    const subscription = await this.createSubscription(
      'customer.id',
      billingDto.priceId,
    );
    return subscription;
  }

  private async createCustomer(
    email: string,
    paymentMethodId: string,
  ): Promise<Stripe.Customer> {
    const customer = await stripe.customers.create({
      email,
      payment_method: paymentMethodId,
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });
    return customer;
  }

  private async createSubscription(
    customerId: string,
    priceId: string,
  ): Promise<Stripe.Subscription> {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      expand: ['latest_invoice.payment_intent'],
    });
    return subscription;
  }
}
