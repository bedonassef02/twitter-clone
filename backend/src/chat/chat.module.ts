import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatController } from './chat.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Chat, ChatSchema } from './entities/chat.entity';
import { AuthMiddleware } from '../auth/middlewares/auth.middleware';
import { IsUserUpdatedMiddleware } from '../auth/middlewares/is-user-updated.middleware';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Chat.name, schema: ChatSchema }]),
    AuthModule,
    UsersModule,
  ],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware, IsUserUpdatedMiddleware)
      .forRoutes(ChatController);
  }
}
