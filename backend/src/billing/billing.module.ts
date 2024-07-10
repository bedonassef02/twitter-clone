import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { BillingService } from './billing.service';
import { BillingController } from './billing.controller';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { AuthMiddleware } from '../auth/middlewares/auth.middleware';
import { IsUserUpdatedMiddleware } from '../auth/middlewares/is-user-updated.middleware';
import { MongooseModule } from '@nestjs/mongoose';
import { BillingSchema, Billing } from './entities/billing.entity';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    MongooseModule.forFeature([{ name: Billing.name, schema: BillingSchema }]),
  ],
  controllers: [BillingController],
  providers: [BillingService],
})
export class BillingModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware, IsUserUpdatedMiddleware)
      .forRoutes(BillingController);
  }
}
