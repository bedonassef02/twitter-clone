import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { NotificationsService } from './notifications.service';
import { NotificationsController } from './notifications.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthMiddleware } from '../auth/middlewares/auth.middleware';
import { IsUserUpdatedMiddleware } from '../auth/middlewares/is-user-updated.middleware';
import { UsersModule } from '../users/users.module';
import { AuthModule } from '../auth/auth.module';
import { notificationSchemaHelper } from './utils/notification-schema.helper';

@Module({
  imports: [
    MongooseModule.forFeatureAsync([notificationSchemaHelper]),
    AuthModule,
    UsersModule,
  ],
  controllers: [NotificationsController],
  providers: [NotificationsService],
})
export class NotificationsModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(AuthMiddleware, IsUserUpdatedMiddleware)
      .forRoutes(NotificationsController);
  }
}
