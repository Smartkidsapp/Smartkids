import {
  Injectable,
  OnModuleInit,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  Payment,
  PaymentDocument,
  PaymentStatusEnum,
  PaymentTypeEnum,
} from './schemas/payment.schemas';
import { Model, Types } from 'mongoose';
import { PaypalService } from './paypal.service';
import { StripeService } from './stripe.service';
import { CountPaymentDto } from './dtos/count-payments.dto';
import { PaymentAggregationStagesBuilder } from './payment-aggregation-stages.builder';
import { PaginatePaymentsDto } from './dtos/paginate-payments.dto';
import { PaymentCounter } from './schemas/payment-counter.schemas';
import {
  PaymentContext,
  PaypalRidePaymentContext,
  StripeRidePaymentContext,
} from './types/payment.types';
import { ModuleRef } from '@nestjs/core';
import { BaseService } from 'src/core/BaseService';
import { UserService } from '../users/user.service';
import { UserDocument } from '../users/schemas/users.schema';
import { Etablissement } from '../etablissement/schemas/etablissement.schema';
import Stripe from 'stripe';
import { Boostage, BoostageDocument, BoostageStatusEnum } from '../boostage/schemas/boostage.schema';
import { UserPaymentDto } from './dtos/user-payments.dto';

@Injectable()
export class PaymentService
  extends BaseService<Payment>
  implements OnModuleInit
{
  //private rideService: RideService;
  private userService: UserService;

  constructor(
    @InjectModel(Payment.name) private readonly paymentModel: Model<Payment>,

    @InjectModel(PaymentCounter.name)
    private readonly paymentCounterModel: Model<PaymentCounter>,

    private readonly paypalService: PaypalService,
    private readonly stripeService: StripeService,
    private readonly moduleRef: ModuleRef,
  ) {
    super(paymentModel);
  }



  async payBoostage(
    paymentMethod: string,
    boostage: BoostageDocument,
    user: UserDocument,
    totalPrice: number
  ) {
    const paymentIntent = await this.stripeService.chargeCustomerPaymentMethod(
      totalPrice * 100,
      {
        customerId: user.stripeCustomerId!,
        paymentMethodId: paymentMethod,
        metadata: {
          boostageId: `${boostage._id}`,
        },
      },
    );

    if (paymentIntent.status === 'succeeded') {

      boostage.status = BoostageStatusEnum.PAID;
      boostage.paymentIntentId = paymentIntent.id;
      boostage.paidAt = new Date();
      boostage.save();
      
      return this.handlePaymentIntentSucceeded({
        boostage,
        user,
        paymentIntent,
        paymentMethod,
        totalPrice
      });
    }

    // TODO: handle payment failure.
    /**
     * Handle specifically require actions -> tell the client to complete the next action.
     * Handle payment failure -> send error message.
     */
    return null;
  }

  async handlePaymentIntentSucceeded({
    boostage,
    paymentIntent,
    user,
    paymentMethod = '',
    totalPrice
  }: {
    paymentIntent?: Stripe.PaymentIntent;
    boostage: BoostageDocument,
    user: UserDocument;
    paymentMethod?: string;
    totalPrice: number
  }) {
    const charge = paymentIntent.latest_charge as Stripe.Charge;

    const stripePaymentContext: StripeRidePaymentContext = {
      boostageId: boostage._id.toString(),
      stripe: {
        paymentMethod: paymentMethod,
        paymentItent: paymentIntent.id,
        card: {
          type: charge.payment_method_details.card.brand,
          last4: charge.payment_method_details.card.last4,
        },
      },
    };
    const payment = await this.createPaymentRecord({
      context: stripePaymentContext,
      price: totalPrice,
      ref: boostage._id,
      type: PaymentTypeEnum.RIDE,
      user: user._id,
    });

    return {
      res: paymentIntent.id,
      payment: payment,
      /*invoiceData: await this.invoiceService.generateInvoiceDataFromRideOffer(
        offer,
        payment,
        user,
      ),*/
    };
  }

  async onModuleInit() {
    //this.rideService = await this.moduleRef.get(RideService, { strict: false });
    this.userService = await this.moduleRef.get(UserService, {
      strict: false,
    });
  }

  async createPaymentRecord({
    context,
    ref,
    type,
    user,
    price,
  }: {
    user: Types.ObjectId;
    type: PaymentTypeEnum;
    ref: Types.ObjectId; // Either a subscription or a ride.
    context: PaymentContext;
    price: number;
  }) {
    const number = await this.generateNumber();
    return await this.paymentModel.create({
      user,
      context,
      ref,
      type,
      number,
      price,
    });
  }

  async ensureStripCustomerCreated(user: UserDocument) {
    if (user.stripeCustomerId) {
      return user;
    }

    const stripeCustomer = await this.stripeService.createCustomer({
      email: user.email,
      name: user.name,
      address: {
        country: 'France',
      },
    });

    user.stripeCustomerId = stripeCustomer.id;
    await user.save();
  }

  async paginate(paginateUsersDto: PaginatePaymentsDto, userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalide.');
    }

    const paginateBuilder = new PaymentAggregationStagesBuilder(
      paginateUsersDto,
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
      this.paymentModel.aggregate<PaymentDocument>(listStages),
      this.paymentModel.aggregate<{ count: number }>(countStages),
    ]);

    const total = countRes.length ? countRes[0].count : 0;
    const pagesCount = Math.ceil(total / paginateUsersDto.limit);
    const hasMore = paginateUsersDto.page < pagesCount;

    return {
      data,
      total: total,
      has_more: hasMore,
      page: paginateUsersDto.page,
      limit: paginateUsersDto.limit,
      total_pages: pagesCount,
    };
  }

  async findBoostagesByUser(
    userId: string,
    userPaymentDto: UserPaymentDto
  ) {
    console.log(userId);
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Identifiants invalide.');
    }
    
    const filter: any = {user: new Types.ObjectId(userId)};

    if(userPaymentDto.type) {
      filter.type = userPaymentDto.type
    }

    const payments = await this.paymentModel.find(filter)
    .populate({
      path: 'ref',
      model: 'Boostage'
    })
    .sort({createdAt: -1})
    .limit(100);
    
    return payments;
  }

  async count(filterDto: CountPaymentDto, userId: string) {
    const user = await this.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Identifiant invalide.');
    }

    const paginateBuilder = new PaymentAggregationStagesBuilder(
      filterDto,
      user._id,
    );

    const { countStages } = paginateBuilder
      .lookupUnwinds()
      .match()
      .buildStages();

    const countResponse = await this.paymentModel.aggregate<{
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

  async generateNumber() {
    return await this.paymentCounterModel.findOneAndUpdate(
      {},
      { $inc: { value: 1 } },
      {
        new: true,
        upsert: true,
      },
    );
  }

  async refundRide(rideId: string) {
    const payment = await this.paymentModel.findOne({
      type: PaymentTypeEnum.RIDE,
      ref: new Types.ObjectId(rideId),
    });

    if (!payment) {
      return false;
    }

    let refunded = false;

    const context = payment.context as
      | StripeRidePaymentContext
      | PaypalRidePaymentContext;
    if ('stripe' in context) {
      const {
        stripe: { paymentItent },
      } = context;
      const stripeRefund = await this.stripeService.refundPayment(paymentItent);

      refunded = stripeRefund.status === 'succeeded';
    } else {
      const {
        paypal: { capture_id },
      } = context;

      const paypalRefund = await this.paypalService.refundCapture(capture_id);

      refunded = paypalRefund.status === 'COMPLETED';
    }

    if (refunded) {
      payment.status = PaymentStatusEnum.REFUNDED;
      await payment.save();
    }

    return refunded;
  }
}
