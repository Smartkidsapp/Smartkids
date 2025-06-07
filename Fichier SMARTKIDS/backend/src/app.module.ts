import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { CacheModule } from '@nestjs/cache-manager';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './app/auth/auth.module';
import { UserModule } from './app/users/user.module';
import { MongooseModule } from '@nestjs/mongoose';
import config, { AppConfig, configValidationSchema } from './core/config';
import { join } from 'path';
import { JwtModule } from '@nestjs/jwt';
import { MailerModule } from '@nestjs-modules/mailer';
import { TEMPLATES_DIR } from './core/constants/dir.constants';
import { TokenModule } from './app/tokens/token.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UniqueConstraintMongoose } from './core/validators/IsUniqueMongoose.validator';
import { RedisClientOptions } from 'redis';
import { redisStore } from 'cache-manager-redis-yet';
import { BullModule } from '@nestjs/bull';
import { GeolocationModule } from './app/geolocation/geolocation.module';
import { MediaModule } from './app/medias/media.module';
import { MessengerModule } from './app/messenger/messenger.module';
import { EtablissementModule } from './app/etablissement/etablissement.module';
import { OptionModule } from './app/option/option.module';
import { CategoryModule } from './app/category/category.module';
import { PaymentModule } from './app/payments/payments.module';
import { SubscriptionModule } from './app/subscriptions/subscription.module';
import { BoostageModule } from './app/boostage/boostage.module';
import { RatingModule } from './app/ratings/rating.module';
import { FavoriteModule } from './app/favorite/favorite.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env'],
      load: [config],
      isGlobal: true,
      cache: true,
      validationSchema: configValidationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        uri: configService.get<string>('MONGODB_URI'),
        dbName: configService.get('DB_NAME'),
      }),
      inject: [ConfigService],
    }),
    MailerModule.forRootAsync({
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        transport: configService.get<string>('MAILER_DSN'),
        defaults: {
          from: `"SmartKids" <${configService.get<string>('APP_EMAIL')}>`,
        },
        template: {
          dir: join(TEMPLATES_DIR, 'emails'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
        options: {
          partials: {
            dir: join(TEMPLATES_DIR, 'emails/partials'),
            options: {
              strict: true,
            },
          },
        },
      }),
      inject: [ConfigService],
    }),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService<AppConfig>) => ({
        secret: configService.get<string>('JWT_SECRET'),
        global: true,
      }),
      inject: [ConfigService],
      global: true,
    }),
    CacheModule.registerAsync<RedisClientOptions>({
      isGlobal: true,
      useFactory: (configService: ConfigService<AppConfig>) => ({
        url: configService.get('REDIS_URL'),
        store: redisStore,
      }),
      inject: [ConfigService],
    }),
    BullModule.forRootAsync({
      useFactory: (configService: ConfigService<AppConfig>) => {
        return {
          url: configService.get('REDIS_URL'),
          redis: {
            db: 2,
            connectionName: 'bull-module',
          },
        };
      },
      inject: [ConfigService],
    }),
    EventEmitterModule.forRoot({
      global: true,
    }),

    AuthModule,
    UserModule,
    TokenModule,
    GeolocationModule,
    MediaModule,
    MessengerModule,
    EtablissementModule,
    OptionModule,
    CategoryModule,
    PaymentModule,
    SubscriptionModule,
    BoostageModule,
    RatingModule,
    FavoriteModule
  ],
  controllers: [AppController],
  providers: [AppService, UniqueConstraintMongoose],
})
export class AppModule {}
