import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserDocument } from '../users/schemas/users.schema';
import { UserService } from '../users/user.service';
import { SigninDto } from './dtos/signin.dto';
import { SignupDto } from './dtos/signup.dto';
import { TokenService } from '../tokens/token.service';
import authStrings from './contants/auth.strings';
import { EventEmitter2 } from '@nestjs/event-emitter';
import {
  OTPCreatedEvent,
  OTP_CREATED_EVENT_NAME,
} from '../tokens/events/otp-emailcreate.event';
import { OTPType } from '../tokens/schemas/otp.schema';
import { RequestOTPDto } from './dtos/request-otp.dto';
import { VerifyPasswordOtpDto } from './dtos/verify-password-otp.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import {
  SuccessResponse,
  SuccessResponseEnum,
} from 'src/core/httpResponse/SuccessReponse';
import AuthResponseCode from './contants/auth-response-code';
import { Types } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly tokenService: TokenService,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  async signin(signinUserDto: SigninDto) {
    const { email, password } = signinUserDto;
    const user = await this.userService.findByEmail(email);
    if (
      !user ||
      !(await this.tokenService.hashMatches(user.password, password))
    ) {
      throw new UnauthorizedException(
        authStrings.E_PASSWORD_EMAIL_INCORRECT,
        AuthResponseCode.E_INVALID_CREDENTIALS,
      );
    }

    if (!user.emailVerified) {
      const access_token = this.tokenService.generateOTPJwt(
        OTPType.EMAIL_VERIFICATION,
        user,
      );
      const otp = await this.tokenService.generateOtp(
        user._id.toString(),
        OTPType.EMAIL_VERIFICATION,
      );

      this.eventEmitter.emit(
        OTP_CREATED_EVENT_NAME,
        new OTPCreatedEvent(user, OTPType.EMAIL_VERIFICATION, otp),
      );

      return new SuccessResponse(
        SuccessResponseEnum.EMAIL_VERIFICATION_PENDING,
        "Votre adresse email n'est pas encore vérifiée. Veuillez vérifier votre adresse email en renseignant le code de verification reçu par mail.",
        {
          access_token,
        },
      );
    }
    
    user.save();

    return await this.generateAuthResponse(user, signinUserDto.rememberMe);
  }

  async signup(signupDto: SignupDto) {
    const { email } = signupDto;
    if (await this.userService.findByEmail(email)) {
      throw new BadRequestException({
        statusCode: 400,
        message: 'Cet email est déjà utilisé',
        errors: {
          email: ['Cet email est déjà utilisé'],
        },
      });
    }

    const { user } = await this.userService.create(signupDto);
    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Votre compte a été créé avec succès, veuillez vérifier votre adresse email pour continuer.',
      {
        access_token: this.tokenService.generateOTPJwt(
          OTPType.EMAIL_VERIFICATION,
          user,
        ),
      },
    );
  }

  async signout({
    tokenId,
    fcmToken,
    userId: userId_,
  }: {
    tokenId?: string;
    fcmToken?: string;
    userId: string;
  }) {
    const userId = new Types.ObjectId(userId_);

    if (tokenId) {
      await this.tokenService.deleteOne({
        _id: new Types.ObjectId(tokenId),
      });
    }

    if (fcmToken) {
      await this.userService.removeFCMToken(fcmToken, userId);
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }
  }

  async verifyEmail({
    otp,
    type,
    email,
  }: {
    email: string;
    otp: string;
    type: OTPType;
  }) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException(
        'Identifiants invalides.',
        AuthResponseCode.E_INVALID_CREDENTIALS,
      );
    }

    const match = await this.tokenService.verifyOTP({
      otp,
      type,
      userId: user._id.toString(),
    });

    if (match) {
      user.emailVerified = true;
      await Promise.all([
        user.save(),
        this.tokenService.removeOTP(type, user._id.toString()),
      ]);

      return this.generateAuthResponse(user, true);
    }

    throw new UnauthorizedException(
      'Token invalide.',
      AuthResponseCode.E_OTP_INVALID,
    );
  }

  private async generateAuthResponse(user: UserDocument, withRefresh = false) {
    const { access_token, refresh_token } =
      await this.tokenService.generateFullJwt(user, withRefresh);

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Email vérifiée avec succès.',
      {
        access_token,
        refresh_token,
        user,
      },
    );
  }

  async requestOTP({ email, type }: RequestOTPDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      return new SuccessResponse(
        SuccessResponseEnum.OK,
        'Code de vérification envoyé.',
      );
    }

    if (type === OTPType.EMAIL_VERIFICATION && user.emailVerified) {
      throw new BadRequestException(authStrings.E_EMAIL_ALREADY_VERIFIED);
    }

    const otp = await this.tokenService.generateOtp(user._id.toString(), type);

    this.eventEmitter.emit(
      OTP_CREATED_EVENT_NAME,
      new OTPCreatedEvent(user, type, otp),
    );

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Code de vérification envoyé.',
      {
        access_token: this.tokenService.generateOTPJwt(type, user),
      },
    );
  }

  async verifyPasswordOtp({ email, otp }: VerifyPasswordOtpDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const match = await this.tokenService.verifyOTP({
      otp,
      type: OTPType.RESET_PASSWORD,
      userId: user._id.toString(),
    });

    if (!match) {
      throw new UnauthorizedException(
        'Token invalide.',
        AuthResponseCode.E_OTP_INVALID,
      );
    }

    return new SuccessResponse(SuccessResponseEnum.OK, 'Code vérifié.', {
      access_token: this.tokenService.generateOTPJwt(
        OTPType.RESET_PASSWORD,
        user,
      ),
    });
  }

  async resetPassword({ email, password }: ResetPasswordDto) {
    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalides.');
    }

    const newPassword = await this.tokenService.hashString(password);
    await this.userService.update(user._id.toString(), {
      password: newPassword,
    });

    return new SuccessResponse(
      SuccessResponseEnum.OK,
      'Mot de passe modifié avec succès.',
    );
  }

  async refreshTokens(id: string, value: string, withRefresh: boolean) {
    let tokenSubject: string;
    try {
      const { sub } = await this.tokenService.verifyJwtToken(value);
      tokenSubject = sub;
    } catch (error) {
      throw new UnauthorizedException();
    }

    const userId = new Types.ObjectId(tokenSubject);
    const tokenId = new Types.ObjectId(id);
    const token = await this.tokenService.getOne({
      _id: tokenId,
      userId,
    });

    if (!token) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException();
    }

    await this.tokenService.deleteOne({
      _id: tokenId,
    });

    return this.tokenService.generateFullJwt(user, withRefresh);
  }
}
