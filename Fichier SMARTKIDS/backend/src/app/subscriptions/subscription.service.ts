import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Subscription,
  SubscriptionDocument,
} from './schemas/subscription.schema';
import { Model, Types } from 'mongoose';
import { PaypalService } from '../payments/paypal.service';
import { SubscriptionPlanService } from './Subscription-plan.service';
import { ModuleRef } from '@nestjs/core';
import { PaginateSubscriptionsDto } from './dto/paginate-subscriptions.dto';
import { SubscriptionAggregationStagesBuilder } from './subscription-aggregation-stages.builder';
import { CountSubscriptionsDto } from './dto/count-subscriptions.dto';
import { PaySubscriptionDto } from './dto/pay-subscription.dto';
import {
  UserDocument,
  UserRoleEnum,
  UserStatusEnum,
} from '../users/schemas/users.schema';
import { PaymentMethodTypeEnum } from '../payments/schemas/payment-method.schema';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { PaypalSubscriptionService } from './paypal-subscription.service';
import { StripeSubscriptionService } from './stripe-subscription.service';
import { BaseService } from 'src/core/BaseService';
import { UserService } from '../users/user.service';

@Injectable()
export class SubscriptionService
  extends BaseService<Subscription>
  implements OnModuleInit
{
  private readonly logger = new Logger(SubscriptionService.name);
  private userService: UserService;

  constructor(
    @InjectModel(Subscription.name)
    private readonly subscriptionModel: Model<Subscription>,
    private readonly paypalService: PaypalService,
    private readonly subscriptionPlanService: SubscriptionPlanService,
    private readonly moduleRef: ModuleRef,
    public readonly paypalSusbcriptionService: PaypalSubscriptionService,
    public readonly stripeSubscriptionService: StripeSubscriptionService,
  ) {
    super(subscriptionModel);
  }

  async onModuleInit() {
    this.userService = await this.moduleRef.get(UserService, {
      strict: false,
    });
  }

  async findByUserId(userId: string): Promise<Subscription[]> {
    return this.subscriptionModel.find({ user: new Types.ObjectId(userId) }).exec();
  }

  /**
   * Setup a recurring subscription for the current user,
   * using the provided payment method and billing intervall.
   *
   * If Successfull, provide access to driver services.
   */
  async setupUserSubscription(
    { paymentMethod, planId, paymentMethodType }: PaySubscriptionDto,
    userId: string,
  ) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Indentifiants invalides.');
    }

    const { status, subscription, message } = await this.canUserPaySubscription(
      user,
      paymentMethodType,
    );

    if (!status) {
      throw new UnauthorizedException(
        message ?? 'Vous avez déjà une souscription en cours.',
      );
    }

    const subscriptionPlan =
      await this.subscriptionPlanService.findById(planId);

    if (!subscriptionPlan) {
      throw new NotFoundException("Formule d'abonnement introuvable.");
    }

    if (paymentMethodType === PaymentMethodTypeEnum.PAYPAL) {
      return await this.paypalSusbcriptionService.setupUserSubscription({
        paymentMethod,
        user,
        subscriptionPlan,
        subscription,
      });
    } else {
      return await this.stripeSubscriptionService.setupUserSubscription({
        paymentMethod,
        user,
        subscriptionPlan,
        subscription,
      });
    }
  }

  async approvePaypalSubscription(id: string) {
    const subscription = await this.subscriptionModel
      .findOne({
        externalSubscriptionRef: id,
        paymentMethodType: PaymentMethodTypeEnum.PAYPAL,
      })
      .populate('plan');

    if (!subscription) {
      throw new NotFoundException('Abonnement non trouvé.');
    }

    const paypalSubscription =
      await this.paypalService.getSubscriptionDetails(id);

    if (paypalSubscription.status === 'ACTIVE') {
      const user = await this.userService.findById(subscription.user._id);
      /**
       * Give the user access as a driver.
       */
      user.status = UserStatusEnum.ACTIVE;
      subscription.paypalSubscriptionId = paypalSubscription.id;

      await Promise.all([subscription.save(), user.save()]);
    }

    // TODO: handle error and send back an error message.
  }

  async getUserSubScription(userId: string) {
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user || user.role !== UserRoleEnum.CLIENT) {
      throw new UnauthorizedException('Action interdite.');
    }

    const subscription = await this.ensureCreated(user._id);
    this.throwIfNoSubscription({ subscription });

    const providerSubscription = await (subscription.paymentMethodType ===
    PaymentMethodTypeEnum.PAYPAL
      ? this.paypalSusbcriptionService.getSubscription(
          subscription.paypalSubscriptionId,
        )
      : this.stripeSubscriptionService.getSubscription(
          subscription.stripeSubscriptionId,
        ));

    return {
      providerSubscription,
      subscription,
    };
  }

  async changeSubscriptionPlan(
    userId: string,
    subscriptionId: string,
    dto: UpdateSubscriptionDto,
  ) {
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user || user.role !== UserRoleEnum.CLIENT) {
      throw new UnauthorizedException('Action interdite.');
    }

    const subscription = await this.subscriptionModel.findOne({
      user: new Types.ObjectId(userId),
      _id: new Types.ObjectId(subscriptionId),
    });

    this.throwIfNoSubscription({ subscription });

    if (subscription.paymentMethodType !== dto.paymentMethodType) {
      throw new BadRequestException(
        'Pour changer de plan, vous devez choisir le même type de méthode de paiement.',
      );
    }

    const subscriptionPlan = await this.subscriptionPlanService.findById(
      dto.planId,
    );

    if (!subscriptionPlan) {
      throw new NotFoundException("Formule d'abonnement introuvable !");
    }

    if (subscription.paymentMethodType === PaymentMethodTypeEnum.PAYPAL) {
      return this.paypalSusbcriptionService.changeSubscriptionPlan({
        paymentMethod: dto.paymentMethod,
        subscription,
        subscriptionPlan,
        user,
      });
    } else {
      return this.stripeSubscriptionService.changeSubscriptionPlan({
        paymentMethod: dto.paymentMethod,
        subscription,
        subscriptionPlan,
        user,
      });
    }
  }

  async cancel(userId: string, subscriptionId: string) {
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user || user.role !== UserRoleEnum.CLIENT) {
      throw new UnauthorizedException('Action interdite.');
    }

    const subscription = await this.subscriptionModel.findOne({
      _id: new Types.ObjectId(subscriptionId),
      user: new Types.ObjectId(userId),
    });

    this.throwIfNoSubscription({ subscription });

    if (subscription.paymentMethodType === PaymentMethodTypeEnum.PAYPAL) {
      await this.paypalSusbcriptionService.cancel(user, subscription);
    } else {
      await this.stripeSubscriptionService.cancel(user, subscription);
    }
  }

  async cancelCancelation(userId: string, subscriptionId: string) {
    const user = await this.userService.findOne({
      _id: new Types.ObjectId(userId),
    });
    if (!user || user.role !== UserRoleEnum.CLIENT) {
      throw new UnauthorizedException('Action interdite.');
    }

    const subscription = await this.subscriptionModel.findOne({
      _id: new Types.ObjectId(subscriptionId),
      user: new Types.ObjectId(userId),
    });

    this.throwIfNoSubscription({ subscription });

    if (subscription.paymentMethodType === PaymentMethodTypeEnum.PAYPAL) {
      /**
       * TODO: Implement cancel cancelation for paypal.
       */
      return;
    } else {
      await this.stripeSubscriptionService.cancelCancelation(
        user,
        subscription,
      );
    }
  }

  async paginate(paginateDto: PaginateSubscriptionsDto, userId: string) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalide.');
    }

    const paginateBuilder = new SubscriptionAggregationStagesBuilder(
      paginateDto,
      user._id,
    );

    const { listStages, countStages } = paginateBuilder
      .lookupUnwinds()
      .match()
      .sort()
      .skip()
      .limit()
      .project()
      .buildStages();

    const [data, countRes] = await Promise.all([
      this.subscriptionModel.aggregate<SubscriptionDocument>(listStages),
      this.subscriptionModel.aggregate<{ count: number }>(countStages),
    ]);

    const total = countRes.length ? countRes[0].count : 0;
    const pagesCount = Math.ceil(total / paginateDto.limit);
    const hasMore = paginateDto.page < pagesCount;

    return {
      data,
      total: total,
      has_more: hasMore,
      page: paginateDto.page,
      limit: paginateDto.limit,
      total_pages: pagesCount,
    };
  }

  async count(filterDto: CountSubscriptionsDto, userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Identifiant invalide.');
    }

    const paginateBuilder = new SubscriptionAggregationStagesBuilder(
      filterDto,
      user._id,
    );

    const { countStages } = paginateBuilder
      .lookupUnwinds()
      .match()
      .buildStages();

    const countResponse = await this.subscriptionModel.aggregate<{
      count: number;
      _id?: any;
    }>(countStages);

    return filterDto.groupBy
      ? countResponse.reduce(
          (acc, { _id, count }) => {
            return {
              ...acc,
              [_id]: count,
            };
          },
          {} as Record<any, number>,
        )
      : countResponse.length
        ? countResponse[0].count
        : 0;
  }

  throwIfNoSubscription({
    subscription,
  }: {
    subscription?: SubscriptionDocument | null;
  }) {
    console.log({
      subscription,
    });
    if (
      !subscription ||
      (!subscription.stripeSubscriptionId &&
        subscription.paymentMethodType === PaymentMethodTypeEnum.STRIPE) ||
      (!subscription.paypalSubscriptionId &&
        subscription.paymentMethodType === PaymentMethodTypeEnum.PAYPAL)
    ) {
      console.log('here');
      throw new NotFoundException('Abonnement non trouvé.');
    }
  }

  async ensureCreated(user: Types.ObjectId) {
    return this.subscriptionModel
      .findOneAndUpdate(
        {
          user: user,
        },
        {},
        {
          new: true,
          upsert: true,
        },
      )
      .populate('plan');
  }

  private async canUserPaySubscription(
    user: UserDocument,
    paymentMethodType: PaymentMethodTypeEnum,
  ): Promise<{
    status: boolean;
    message?: string;
    subscription: SubscriptionDocument | null;
  }> {
    // Check if the user is a driver
    if (user.role !== UserRoleEnum.CLIENT) {
      return {
        status: false,
        message: 'Action non autorisée.',
        subscription: null,
      };
    }
    const subscription = await this.ensureCreated(user._id);

    if (
      !subscription.stripeSubscriptionId &&
      !subscription.paypalSubscriptionId
    ) {
      return {
        status: true,
        subscription,
      };
    }

    const res = await (paymentMethodType === PaymentMethodTypeEnum.STRIPE
      ? this.stripeSubscriptionService.canUserSetupSubscription(
          user,
          subscription,
        )
      : this.paypalSusbcriptionService.canUserSetupSubscription(
          user,
          subscription,
        ));

    return {
      ...res,
      subscription,
    };
  }
}
