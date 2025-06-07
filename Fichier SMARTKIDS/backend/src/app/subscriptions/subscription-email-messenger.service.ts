import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { SubscriptionDocument } from './schemas/subscription.schema';
import { UserDocument } from '../users/schemas/users.schema';

@Injectable()
export class SubscriptionEmailMessenger {
  constructor(
    @InjectQueue('messenger') private readonly messengerQueue: Queue,
  ) {}

  async sendSubscriptionTrialWillEnd({}: {
    user: UserDocument;
    subscription: SubscriptionDocument;
  }) {}

  async sendSubscriptionPaymentFailed({
    errorMessage,
    user,
    subscription,
    url,
  }: {
    user: UserDocument;
    subscription: SubscriptionDocument;
    errorMessage: string;
    url: string;
  }) {
    const { email, name } = user;
    const title = "Paiement d'abonnement échoué";
    return this.messengerQueue.add(
      'send-email',
      {
        to: `"${name}" <${email}>`,
        context: {
          name,
          email,
          title,
          errorMessage,
          offer: subscription.plan,
          url,
        },
        template: 'subscriptions/stripe-subscription-payment-failed',
        subject: title,
      },
      {
        removeOnComplete: true,
      },
    );
  }

  async sendSubscriptionInvoice({
    description,
    email,
    name,
    url,
  }: {
    url: string;
    email: string;
    name: string;
    description: string;
  }) {
    const title = 'La facture de votre abonnement est disponible.';
    const context = {
      title,
      url,
      description,
      name,
    };

    try {
      await this.messengerQueue.add(
        'send-email',
        {
          to: email,
          context,
          template: 'subscriptions/stripe-subscription-invoice',
          subject: title,
        },
        {
          removeOnComplete: true,
        },
      );
    } catch (error) {}
  }
}
