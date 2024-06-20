import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PasswordService } from './services/password.service';
import { UsersModule } from '../users/users.module';
import { IsUniqueConstraint } from './utils/constraints/is-unique.constraint';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TokenService } from './services/token.service';
import { GoogleAuthController } from './oauth/google/controllers/google-auth.controller';
import { GoogleAuthService } from './oauth/google/services/google-auth.service';
import { GoogleStrategy } from './oauth/google/strategies/google.strategy';
import { TwoFactorService } from './services/two-factor.service';
import { AuthMiddleware } from './middlewares/auth.middleware';
import { IsUserUpdatedMiddleware } from './middlewares/is-user-updated.middleware';
import { TwoFactorController } from './controllers/two-factor.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { SecretKey, SecretKeySchema } from './entities/secret-key.entity';

@Module({
  imports: [
    UsersModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET_KEY'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
        },
      }),
    }),
    MongooseModule.forFeature([
      { name: SecretKey.name, schema: SecretKeySchema },
    ]),
  ],
  controllers: [AuthController, TwoFactorController, GoogleAuthController],
  providers: [
    AuthService,
    PasswordService,
    TokenService,
    IsUniqueConstraint,
    GoogleAuthService,
    GoogleStrategy,
    TwoFactorService,
  ],
  exports: [TokenService],
})
export class AuthModule implements NestModule {
  configure(consumer: MiddlewareConsumer): any {
    consumer
      .apply(AuthMiddleware, IsUserUpdatedMiddleware)
      .forRoutes(TwoFactorController);
  }
}
