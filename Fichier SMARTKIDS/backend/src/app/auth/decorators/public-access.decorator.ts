import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_ACCESS_KEY = 'auth:isPublic';
export const PublicAccess = () => SetMetadata(IS_PUBLIC_ACCESS_KEY, true);
