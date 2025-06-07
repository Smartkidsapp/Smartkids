import { Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  SubscriptionPlan,
  SubscriptionPlanDocument,
} from './schemas/subscription-plan.schema';
import { Model, Types } from 'mongoose';
import { StripeService } from '../payments/stripe.service';
import { PaypalService } from '../payments/paypal.service';
import { CreateSubscriptionPlansDto } from './dto/create-subscription-plan.dto';
import { ConfigService } from '@nestjs/config';
import { AppConfig } from 'src/core/config';
import { UserService } from '../users/user.service';

@Injectable()
export class SubscriptionPlanService implements OnModuleInit {
  constructor(
    @InjectModel(SubscriptionPlan.name)
    private readonly subscriptionPlanModel: Model<SubscriptionPlan>,
    private readonly stripeService: StripeService,
    private readonly paylpalService: PaypalService,
    private readonly configService: ConfigService<AppConfig>,
    private readonly userService: UserService,
  ) {}

  async findById(id: string | Types.ObjectId) {
    const subscriptionId = typeof id === 'string' ? id : new Types.ObjectId(id);

    return await this.subscriptionPlanModel.findById(subscriptionId);
  }

  async onModuleInit() {
    /**
     * Ensure that there is at least one monthly plan and one yearly plan.
     */
    const defaultMontlyPrice = parseFloat(
      this.configService.get('MONTHLY_PLAN_PRICE'),
    );
    const defaultYearlyPrice = parseFloat(
      this.configService.get('YEARLY_PLAN_PRICE'),
    );

    const [monthlyPlan, yearlyPlan, countPlan] = await Promise.all([
      this.subscriptionPlanModel.findOne({
        interval_unit: 'month',
        interval_count: 1,
      }),

      this.subscriptionPlanModel.findOne({
        interval_unit: 'year',
        interval_count: 1,
      }),

      this.subscriptionPlanModel.countDocuments(),
    ]);

    if (!monthlyPlan && countPlan === 0) {
      await this.create({
        name: 'Standard.',
        description: 'Abonnement mensuel.',
        interval_count: 1,
        interval_unit: 'month',
        price: defaultMontlyPrice,
        trial_interval_count: 0,
        trial_interval_unit: 'month',
      });
    }

    if (!yearlyPlan && countPlan === 0) {
      await this.create({
        name: 'Premium.',
        description: 'Abonnement annuel.',
        interval_count: 1,
        interval_unit: 'year',
        price: defaultYearlyPrice,
        trial_interval_count: 0,
        trial_interval_unit: 'month',
      });
    }

    // if (!freePlan && countPlan === 0) {
    //   await this.create({
    //     name: 'Gratuit.',
    //     description: 'Abonnement gratuit.',
    //     interval_count: 1,
    //     interval_unit: 'month',
    //     price: 0,
    //     trial_interval_count: 0,
    //     trial_interval_unit: 'month',
    //   });
    // }
  }

  async list() {
    return await this.subscriptionPlanModel.find().sort({ createdAt: -1 });
  }
  
  async create(dto: CreateSubscriptionPlansDto) {
    const {
      interval_count,
      interval_unit,
      trial_interval_count,
      trial_interval_unit,
      description,
      name,
      price,
    } = dto;

    if (price == 0) {
      return await this.subscriptionPlanModel.findOneAndUpdate(
        {
          description,
          name,
          price,
        },
        {
          $set: {
            interval_count,
            interval_unit,
            paypal_plan_id: 'free',
            paypal_plan_without_trial_id: 'free',
            stripe_price_id: 'free',
            trial_interval_count: trial_interval_count,
            trial_interval_unit,
          },
        },
        {
          new: true,
        },
      );
    }

    const existingSubscription = await this.subscriptionPlanModel.findOne({
      interval_count,
      interval_unit,
    });

    if (existingSubscription) {
      return await this.updateSubscriptionPlan(existingSubscription, dto);
    }

    const [stripePrice, paypalPlan] = await Promise.all([
      this.stripeService.createSubscriptionPrice({
        interval: interval_unit,
        interval_count: interval_count,
        price: price,
      }),
      /*
      this.paylpalService.createPlan({
        description,
        name,
        regular: {
          interval_count: interval_count,
          interval_unit: interval_unit.toUpperCase() as
            | 'DAY'
            | 'WEEK'
            | 'MONTH'
            | 'YEAR',
          price,
        },
        trial: {
          interval_count: trial_interval_count,
          interval_unit: trial_interval_unit.toUpperCase() as
            | 'DAY'
            | 'WEEK'
            | 'MONTH'
            | 'YEAR',
        },
      }),*/null
    ]);

    const plan = await this.subscriptionPlanModel.create({
      description,
      name,
      price,
      interval_count,
      interval_unit,
      //paypal_plan_id: paypalPlan.withTrial.id,
      //paypal_plan_without_trial_id: paypalPlan.withoutTrial.id,
      stripe_price_id: stripePrice.id,
      trial_interval_count: trial_interval_count,
      trial_interval_unit,
    });

    return plan;
  }

  async update(id: string, dto: CreateSubscriptionPlansDto) {
    const subscription = await this.subscriptionPlanModel.findById(
      new Types.ObjectId(id),
    );

    if (!subscription) {
      throw new NotFoundException('Formule non trouvée.');
    }

    return await this.updateSubscriptionPlan(subscription, dto);
  }

  async updateSubscriptionPlan(
    subscriptionPlan: SubscriptionPlanDocument,
    {
      description,
      name,
      interval_count,
      interval_unit,
      trial_interval_count,
      trial_interval_unit,
      price,
    }: CreateSubscriptionPlansDto,
  ) {
    const [stripePrice] = await Promise.all([
      this.stripeService.editSubscriptionPrice({
        interval: interval_unit,
        interval_count: interval_count,
        price,
        priceID: subscriptionPlan.stripe_price_id,
      })
    ]);

    subscriptionPlan.name = name;
    subscriptionPlan.description = description;
    subscriptionPlan.interval_count = interval_count;
    subscriptionPlan.interval_unit = interval_unit;
    subscriptionPlan.trial_interval_count = trial_interval_count;
    subscriptionPlan.trial_interval_unit = trial_interval_unit;
    subscriptionPlan.price = price;
    subscriptionPlan.paypal_plan_id = null;
    subscriptionPlan.paypal_plan_without_trial_id =null;
    subscriptionPlan.stripe_price_id = stripePrice.id;

    await subscriptionPlan.save();

    return subscriptionPlan;
  }

  async delete(id: string) {
    const planId = new Types.ObjectId(id);
    const subscriptionPlan = await this.subscriptionPlanModel.findById(planId);
    if (!subscriptionPlan) {
      throw new NotFoundException("Formule d'abonnement introuvable");
    }

    await Promise.all([
      this.stripeService.deletePrice(subscriptionPlan.stripe_price_id),
      this.paylpalService.deactivatePlan(subscriptionPlan.paypal_plan_id),
    ]);

    await this.subscriptionPlanModel.deleteOne({ _id: planId });
  }
}
