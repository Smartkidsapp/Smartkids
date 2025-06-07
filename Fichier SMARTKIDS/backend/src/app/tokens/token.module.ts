import { Module, forwardRef } from '@nestjs/common';
import { TokenService } from './token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, TokenSchema } from './schemas/token.schema';
import { TokenListener } from './listeners/token.listener';
import { OTP, OTPSchema } from './schemas/otp.schema';
import { UserModule } from '../users/user.module';

@Module({
  providers: [TokenService, TokenListener],
  imports: [
    forwardRef(() => UserModule),
    MongooseModule.forFeature([
      { name: Token.name, schema: TokenSchema },
      { name: OTP.name, schema: OTPSchema },
    ]),
  ],
  exports: [TokenService],
})
export class TokenModule {}
