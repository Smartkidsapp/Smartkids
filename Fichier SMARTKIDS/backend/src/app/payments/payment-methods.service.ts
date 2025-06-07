import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { E_NOT_PAYMENT_METHOD_OWNER, StripeService } from './stripe.service';
import { PaypalService } from './paypal.service';
import { CreatePaypalPaymentTokenDto } from './dtos/create-payment-method.dto';
import { Payment, PaymentDocument } from './schemas/payment.schemas';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { BaseService } from 'src/core/BaseService';
import { UserService } from '../users/user.service';

@Injectable()
export class PaymentMethodService extends BaseService<Payment> {
  constructor(
    private readonly userService: UserService,
    private readonly stripeService: StripeService,
    private readonly paypalService: PaypalService,
    @InjectModel(Payment.name) paymentModel: Model<PaymentDocument>,
  ) {
    super(paymentModel);
  }

  async createStripeSetupIntent(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    if (!user.stripeCustomerId) {
      await this.stripeService.createCustomer({
        email: user.email,
        name: user.name,
        address: {
          country: 'France',
        },
      });
    }

    return this.stripeService.createSetupIntent(user.stripeCustomerId);
  }

  async createPaypSetupToken(userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    return this.paypalService.createSetupToken();
  }

  async listUserPaymentMethod(userId: string, type: 'paypal' | 'stripe') {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    if (type === 'paypal') {
      if (!user.paypalCustomerIds.length) {
        return [];
      }

      const data = await Promise.all(
        user.paypalCustomerIds.map((customerId) =>
          this.paypalService.getCustomerPaymentMethod(customerId),
        ),
      );

      return data.reduce((acc, curr) => {
        acc = [...acc, ...curr];

        return acc;
      }, []);
    }

    if (type === 'stripe') {
      if (!user.stripeCustomerId) {
        const customer = await this.stripeService.createCustomer({
          email: user.email,
          name: user.name,
          address: {
            country: 'France',
          },
        });
        user.stripeCustomerId = customer.id;
        await user.save();
      }

      return this.stripeService.getCustomerPaymentMethod(user.stripeCustomerId);
    }
  }

  async deleteMethod(id: string, userId: string, type: 'paypal' | 'stripe') {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    if (type === 'stripe') {
      try {
        await this.stripeService.deleteCustomerPaymentMethod(
          id,
          user.stripeCustomerId,
        );
      } catch (error) {
        console.log({ error });
        if (error.message === E_NOT_PAYMENT_METHOD_OWNER) {
          throw new UnauthorizedException('Operation interdite');
        }

        throw new Error('Un problème est survenue.');
      }
    }

    if (type === 'paypal') {
      try {
        await this.paypalService.deletePaymentMethod(id, user);

        return;
      } catch (error) {
        if (error.message === E_NOT_PAYMENT_METHOD_OWNER) {
          throw new UnauthorizedException('Operation interdite');
        }

        throw new Error('Un problème est survenue.');
      }
    }
  }

  async confirmPaypalPm(
    userId: string,
    createPaypalPaymentTokenDto: CreatePaypalPaymentTokenDto,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

    await this.paypalService.createPaymentToken(
      createPaypalPaymentTokenDto.vaultSetupToken,
      user,
    );
  }
}
