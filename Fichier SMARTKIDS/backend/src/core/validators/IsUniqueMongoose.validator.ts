import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Injectable()
@ValidatorConstraint({ name: 'Unique', async: true })
export class UniqueConstraintMongoose implements ValidatorConstraintInterface {
  constructor(
    @InjectConnection() private readonly mongooseConnection: Connection,
  ) {}

  async validate(value: any, args: ValidationArguments): Promise<boolean> {
    const [model, uniqueField] = args.constraints;

    try {
      if (!this.mongooseConnection.model(model)) {
        return false;
      }

      /**
       * The user must be able to update his phone number or to submit the
       * same phone number.
       */
      if (uniqueField === 'phone') {
        const email = args.object['email'];
        if (
          await this.mongooseConnection.model(model as string).findOne({
            [uniqueField]: value,
            email,
          })
        ) {
          return true;
        }
      }

      const result = await this.mongooseConnection
        .model(model as string)
        .findOne({
          [uniqueField]: value,
        });

      return !result;
    } catch (e) {
      return false;
    }
  }

  defaultMessage(args: ValidationArguments) {
    const [model] = args.constraints;
    return ` this ${args.property} exist in table ${model}`;
  }
}

export function IsUniqueMongoose(
  model: string,
  uniqueField: string,
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [model, uniqueField],
      validator: UniqueConstraintMongoose,
    });
  };
}
