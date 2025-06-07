import { JwtTokenPayload } from 'src/app/auth/types/jwt-token-payload';
import { AppConfig } from 'src/core/config';

export {};

declare global {
  namespace Express {
    export interface Request {
      user?: JwtTokenPayload;
    }
  }

  namespace NodeJS {
    interface ProcessEnv extends AppConfig {
      PORT: string;
    }
  }
}
