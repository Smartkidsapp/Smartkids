import { Module, forwardRef } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './schemas/users.schema';
import { UserListener } from './listeners/users.listener';
import { TokenModule } from '../tokens/token.module';
import { MediaModule } from '../medias/media.module';
import { FCMToken, FCMTokenSchema } from './schemas/Fcm-token.schemas';
import { UserAddress, UserAddressSchema } from './schemas/user-address.schemas';
import { AdminUserController } from './admin.user.controller';
import { Category, CategorySchema } from '../category/schemas/category.schema';
import { Option, OptionSchema } from '../option/schemas/option.schema';
import { Etablissement, EtablissementSchema } from '../etablissement/schemas/etablissement.schema';
import { SubscriptionPlan, SubscriptionPlanSchema } from '../subscriptions/schemas/subscription-plan.schema';

@Module({
  controllers: [UserController, AdminUserController],
  providers: [UserService, UserListener],
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: FCMToken.name, schema: FCMTokenSchema },
      { name: UserAddress.name, schema: UserAddressSchema },
      { name: UserAddress.name, schema: UserAddressSchema },
      { name: Category.name, schema: CategorySchema },
      { name: Option.name, schema: OptionSchema },
      { name: Etablissement.name, schema: EtablissementSchema },
      { name: SubscriptionPlan.name, schema: SubscriptionPlanSchema },
    ]),
    forwardRef(() => TokenModule),
    MediaModule,
  ],
  exports: [UserService],
})
export class UserModule {}
