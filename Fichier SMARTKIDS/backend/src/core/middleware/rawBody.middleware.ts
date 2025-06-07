import { Response, Request } from 'express';
import { json } from 'body-parser';

export interface RequestWithRawBody extends Request {
  rawBody: Buffer;
}

function rawBodyMiddleware() {
  return json({
    verify: (request: RequestWithRawBody, _: Response, buffer: Buffer) => {
      if (
        request.url?.startsWith('/api/v1/stripe-webhook') &&
        Buffer.isBuffer(buffer)
      ) {
        request.rawBody = Buffer.from(buffer);
      }
      return true;
    },
  });
}

export default rawBodyMiddleware;
