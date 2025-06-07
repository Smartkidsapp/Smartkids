import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { PublicAccess } from './decorators/public-access.decorator';
import { SignupDto } from './dtos/signup.dto';
import { SigninDto } from './dtos/signin.dto';
import { ApiBadRequestResponse, ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RequestOTPDto } from './dtos/request-otp.dto';
import { OTPJwtSub } from './decorators/jwt-sub.decorator';
import { OTPType } from '../tokens/schemas/otp.schema';
import { VerifyEmailDto } from './dtos/verify-email.dto';
import { VerifyPasswordOtpDto } from './dtos/verify-password-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { extractTokenFromHeader } from './utils/auth.utils';
import {
  SuccessResponse,
  SuccessResponseEnum,
} from 'src/core/httpResponse/SuccessReponse';
import { Request } from 'express';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @PublicAccess()
  @ApiBadRequestResponse()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() signinpDto: SigninDto) {
    return this.authService.signin(signinpDto);
  }

  @PublicAccess()
  @ApiBadRequestResponse()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signup(@Body() signupDto: SignupDto) {
    return this.authService.signup(signupDto);
  }

  @ApiBearerAuth()
  @Post('/signout')
  @HttpCode(HttpStatus.OK)
  signout(
    @Headers('X-Refresh-Token-Id') tokenId: string,
    @Headers('X-FCM-Token') fcmToken: string,
    @Req() request: Request,
  ) {
    const userId = request.user.sub;
    console.log({ tokenId, fcmToken, userId });
    if (!tokenId) {
      throw new UnauthorizedException();
    }
    return this.authService.signout({
      userId,
      tokenId,
      fcmToken,
    });
  }

  // @Post('password-forgotten')
  @Post('/request-otp')
  @PublicAccess()
  requestEmailOtp(@Body() requestEmailOtp: RequestOTPDto) {
    return this.authService.requestOTP(requestEmailOtp);
  }

  @OTPJwtSub(OTPType.EMAIL_VERIFICATION)
  @ApiBearerAuth()
  @Post('/verify-email')
  @HttpCode(HttpStatus.OK)
  verify(@Body() verifyTokenDto: VerifyEmailDto) {
    return this.authService.verifyEmail(verifyTokenDto);
  }

  @PublicAccess()
  @Post('/verify-password-otp')
  @HttpCode(HttpStatus.OK)
  verifyPasswordOtp(@Body() verifyPasswordDto: VerifyPasswordOtpDto) {
    return this.authService.verifyPasswordOtp(verifyPasswordDto);
  }

  @OTPJwtSub(OTPType.RESET_PASSWORD)
  @ApiBearerAuth()
  @Post('/reset-password')
  @HttpCode(HttpStatus.OK)
  resetPassword(@Body() resetPasswordDto: ResetPasswordDto) {
    return this.authService.resetPassword(resetPasswordDto);
  }

  @PublicAccess()
  @Post('/refresh-token')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Headers('Authorization') authorization: string,
    @Headers('X-Refresh-Token-Id') tokenId: string,
    @Query('with-refresh') withRefresh: number,
  ) {
    const token = extractTokenFromHeader(authorization);
    if (!token || !tokenId) {
      throw new UnauthorizedException();
    }

    const response = await this.authService.refreshTokens(
      tokenId,
      token,
      !!withRefresh,
    );

    return new SuccessResponse(SuccessResponseEnum.OK, undefined, response);
  }
}
