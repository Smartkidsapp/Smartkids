import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_ACCESS_KEY } from './decorators/public-access.decorator';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/core/config';
import {
  FullTokenPayload,
  JwtTokenPayload,
  OTPTokenPayload,
} from './types/jwt-token-payload';
import { ONLY_ROLES_DECORATOR_KEY } from './decorators/only-roles.decorator';
import { UserRoleEnum } from '../users/schemas/users.schema';
import authStrings from './contants/auth.strings';
import { Request } from 'express';
import { OTP_JWT_SUB_DECORATOR_KEY } from './decorators/jwt-sub.decorator';
import { OTPType } from '../tokens/schemas/otp.schema';
import AuthResponseCode from './contants/auth-response-code';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService<AppConfig>,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPubliclyAccessible = this.reflector.getAllAndOverride<boolean>(
      IS_PUBLIC_ACCESS_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (isPubliclyAccessible) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);
    if (!token) {
      throw new UnauthorizedException(
        authStrings.E_MISSING_CREDENTIALS,
        AuthResponseCode.E_MISSING_CREDENTIALS,
      );
    }

    let payload: JwtTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtTokenPayload>(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw new UnauthorizedException(
        authStrings.E_UNAUTHORIZED,
        AuthResponseCode.E_AUTH_UNAUTHORIZED,
      );
    }

    if ('email' in payload) {
      return this.checkOTPSubGuard(payload, context);
    }

    return this.checkFullGuard(payload, context);
  }

  private checkFullGuard(
    payload: FullTokenPayload,
    context: ExecutionContext,
  ): boolean {
    const { role, ok } = payload;

    if (!ok) {
      throw new ForbiddenException(
        'Adresse email non vérifié. Vous devez vérifier votre adresse email pour accéder à cette ressource.',
        AuthResponseCode.E_FORBIDEN,
      );
    }

    const request = context.switchToHttp().getRequest();
    const roles =
      this.reflector.get<UserRoleEnum[]>(
        ONLY_ROLES_DECORATOR_KEY,
        context.getHandler(),
      ) ?? [];

    if (Array.isArray(roles) && roles.length && !roles.includes(role)) {
      throw new ForbiddenException(
        authStrings.E_FORBIDEN,
        AuthResponseCode.E_FORBIDEN,
      );
    }

    request['user'] = payload;

    return true;
  }

  private checkOTPSubGuard(
    payload: OTPTokenPayload,
    context: ExecutionContext,
  ): boolean {
    try {
      const { sub } = payload;

      const request = context.switchToHttp().getRequest();
      request['user'] = payload;

      const policyHandlers =
        this.reflector.get<OTPType[]>(
          OTP_JWT_SUB_DECORATOR_KEY,
          context.getHandler(),
        ) || [];

      return policyHandlers.includes(sub);
    } catch (error) {
      throw new UnauthorizedException(
        authStrings.E_UNAUTHORIZED,
        AuthResponseCode.E_UNAUTHORIZED,
      );
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
