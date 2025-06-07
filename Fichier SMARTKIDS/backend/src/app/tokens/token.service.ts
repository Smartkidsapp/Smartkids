import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserDocument, UserRoleEnum } from '../users/schemas/users.schema';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/core/config';
import { FilterQuery, Model, Types } from 'mongoose';
import { Token, TokenType } from './schemas/token.schema';
import * as argon2 from 'argon2';
import { InjectModel } from '@nestjs/mongoose';
import dayjs from 'dayjs';
import { randomInt } from 'crypto';
import authStrings from '../auth/contants/auth.strings';
import { OTP, OTPType } from './schemas/otp.schema';
import {
  FullTokenPayload,
  OTPTokenPayload,
} from '../auth/types/jwt-token-payload';
import AuthResponseCode from '../auth/contants/auth-response-code';

@Injectable()
export class TokenService {
  constructor(
    @InjectModel(Token.name) private readonly tokenModel: Model<Token>,
    @InjectModel(OTP.name) private readonly otpModel: Model<OTP>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
  ) {}

  async generateFullJwt(
    user: UserDocument,
    withRefresh: boolean | undefined = false,
  ): Promise<{
    access_token: string;
    refresh_token?: {
      id: string;
      value: string;
    };
  }> {
    let role = user.role;

    if (
      user.role === UserRoleEnum.DRIVER &&
      (user.activeRole !== UserRoleEnum.DRIVER || !user.isSeller)
    ) {
      role = UserRoleEnum.CLIENT;
    }

    const payload: FullTokenPayload = {
      sub: user._id.toString(),
      role,
      ok: user.emailVerified,
    };
    const secret = this.configService.get('JWT_SECRET');

    const access_token = this.jwtService.sign(payload, {
      expiresIn:
        this.configService.get('ACCESS_TOKEN_TIME_VALUE') +
        this.configService.get('ACCESS_TOKEN_TIME_UNIT'),
      secret,
    });

    let refresh_token:
      | {
          id: string;
          value: string;
        }
      | undefined = undefined;
    if (withRefresh) {
      const expiresIn =
        this.configService.get('REFRESH_TOKEN_TIME_VALUE') +
        this.configService.get('REFRESH_TOKEN_TIME_UNIT');

      const tokenValue = this.jwtService.sign(payload, {
        expiresIn,
        secret,
      });

      const token = await this.tokenModel.create({
        type: TokenType.REFRESH_TOKEN,
        value: await this.hashString(tokenValue),
        userId: user._id,
        expiresAt: new Date(
          dayjs()
            .add(
              parseInt(this.configService.get('REFRESH_TOKEN_TIME_VALUE')),
              this.configService.get('REFRESH_TOKEN_TIME_UNIT'),
            )
            .toISOString(),
        ),
      });

      refresh_token = {
        id: token._id.toString(),
        value: tokenValue,
      };
    }

    return {
      access_token,
      refresh_token,
    };
  }

  async generateOtp(
    userId_: string,
    type: OTPType = OTPType.EMAIL_VERIFICATION,
  ) {
    const otp = randomInt(100000, 999999).toString();
    const today = dayjs().add(24, 'hour');

    const userId = new Types.ObjectId(userId_);

    // Create or update the existing one.
    await this.otpModel.findOneAndUpdate(
      {
        type,
        userId,
      },
      {
        $set: {
          type,
          userId,
          expiresAt: new Date(today.toISOString()),
          value: await this.hashString(otp),
        },
      },
      {
        new: true,
        upsert: true,
      },
    );

    return otp;
  }

  generateOTPJwt(type: OTPType, user: UserDocument) {
    const payload: OTPTokenPayload = {
      sub: type,
      email: user.email,
    };

    const access_token = this.jwtService.sign(payload, {
      expiresIn: '1h',
      secret: this.configService.get('JWT_SECRET'),
    });

    return access_token;
  }

  async verifyOTP({
    otp,
    type,
    userId,
  }: {
    userId: string;
    otp: string;
    type: OTPType;
  }) {
    const now = new Date();
    const token = await this.otpModel.findOne({
      type,
      userId: new Types.ObjectId(userId),
    });

    if (!token || !(await this.hashMatches(token.value, otp))) {
      throw new UnauthorizedException(
        authStrings.E_UNAUTHORIZED,
        AuthResponseCode.E_OTP_INVALID,
      );
    }

    if (now.getTime() >= token.expiresAt.getTime()) {
      throw new UnauthorizedException(
        authStrings.E_EXPIRED_TOKEN,
        AuthResponseCode.E_OTP_EXPIRED,
      );
    }

    return true;
  }

  async removeOTP(type: OTPType, userId: string) {
    return this.otpModel.deleteOne({
      userId: new Types.ObjectId(userId),
      type,
    });
  }

  async getOne(filter: FilterQuery<Token>) {
    return this.tokenModel.findOne(filter);
  }

  async deleteOne(filter: FilterQuery<Token>) {
    return this.tokenModel.findOneAndDelete(filter);
  }

  hashString(password: string): Promise<string> {
    return argon2.hash(password);
  }

  async verifyJwtToken(token: string) {
    return await this.jwtService.verifyAsync<FullTokenPayload>(token, {
      secret: this.configService.get('JWT_SECRET'),
    });
  }

  async hashMatches(hash: string, plainText: string): Promise<boolean> {
    try {
      return await argon2.verify(hash, plainText);
    } catch (error) {}

    return false;
  }
}
