import {
  Injectable,
  BadRequestException,
  ValidationPipe,
  ValidationPipeOptions,
} from '@nestjs/common';

@Injectable()
export class ClassValidationPipe extends ValidationPipe {
  constructor(options_?: ValidationPipeOptions) {
    const options = options_ ?? {};

    super({
      ...options,
      exceptionFactory(errors) {
        const errorDetails = errors.map((err) => {
          return {
            [err.property]: Object.values(err.constraints),
          };
        });

        throw new BadRequestException({
          statusCode: 400,
          message:
            'Les données soumises sont incorrects. Veuillez corriger les erreurs puis resoumettre.',
          errors: errorDetails.reduce((acc, curr) => {
            for (const key in curr) {
              if (Object.prototype.hasOwnProperty.call(curr, key)) {
                acc[key] = curr[key];
              }
            }

            return acc;
          }, {}),
        });
      },
    });
  }
}
