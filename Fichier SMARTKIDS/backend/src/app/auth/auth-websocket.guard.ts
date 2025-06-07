import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
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
import { OTP_JWT_SUB_DECORATOR_KEY } from './decorators/jwt-sub.decorator';
import { OTPType } from '../tokens/schemas/otp.schema';
import AuthResponseCode from './contants/auth-response-code';
import { Socket } from 'socket.io';
import { IncomingHttpHeaders } from 'http';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class AuthWsGuard implements CanActivate {
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

    const client = context.switchToWs().getClient<Socket>();
    const token = this.extractTokenFromHeader(client.handshake.headers);
    if (!token) {
      throw new WsException(authStrings.E_MISSING_CREDENTIALS);
    }

    let payload: JwtTokenPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtTokenPayload>(token, {
        secret: this.configService.get('JWT_SECRET'),
      });
    } catch (error) {
      throw new WsException(authStrings.E_UNAUTHORIZED);
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
        'Adresse email non vérifiée. Vous devez vérifier votre adresse email pour accéder à cette ressource.',
        AuthResponseCode.E_FORBIDEN,
      );
    }

    const client = context.switchToWs().getClient<Socket>();
    const roles =
      this.reflector.get<UserRoleEnum[]>(
        ONLY_ROLES_DECORATOR_KEY,
        context.getHandler(),
      ) ?? [];

    if (Array.isArray(roles) && roles.length && !roles.includes(role)) {
      throw new WsException(authStrings.E_FORBIDEN);
    }

    client.handshake.auth = payload;

    return true;
  }

  private checkOTPSubGuard(
    payload: OTPTokenPayload,
    context: ExecutionContext,
  ): boolean {
    try {
      const { sub } = payload;

      const client = context.switchToWs().getClient<Socket>();

      const policyHandlers =
        this.reflector.get<OTPType[]>(
          OTP_JWT_SUB_DECORATOR_KEY,
          context.getHandler(),
        ) || [];

      if (!policyHandlers.includes(sub)) {
        return false;
      }
      client.handshake.auth = payload;

      return true;
    } catch (error) {
      throw new WsException(authStrings.E_UNAUTHORIZED);
    }
  }

  private extractTokenFromHeader(
    headers: IncomingHttpHeaders,
  ): string | undefined {
    const [type, token] = headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
