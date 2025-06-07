import * as argon2 from 'argon2';

export function extractTokenFromHeader(
  authorization: string,
): string | undefined {
  const [type, token] = authorization?.split(' ') ?? [];
  return type === 'Bearer' ? token : undefined;
}

export function hashString(password: string): Promise<string> {
  return argon2.hash(password);
}

export function hashMatches(hash: string, plainText: string): Promise<boolean> {
  return argon2.verify(hash, plainText);
}
