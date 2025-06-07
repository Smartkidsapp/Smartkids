import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { seeder } from 'nestjs-seeder';
import { User, UserSchema } from 'src/app/users/schemas/users.schema';
import config, { AppConfig, configValidationSchema } from 'src/core/config';
import { AdminSeeder } from './admin.seeder';

seeder({
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
      useFactory: async (configService: ConfigService<AppConfig>) => {
        return {
          uri: configService.get<string>('MONGODB_URI'),
          dbName: configService.get('DB_NAME'),
        };
      },
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
}).run([AdminSeeder]);
