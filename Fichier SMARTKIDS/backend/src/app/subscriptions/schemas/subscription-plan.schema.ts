import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type SubscriptionIntervalUnit = 'day' | 'week' | 'month' | 'year';

export type SubscriptionPlanDocument = HydratedDocument<SubscriptionPlan>;

@Schema()
export class SubscriptionPlan {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({
    type: String,
    enum: ['day', 'week', 'month', 'year'],
    required: true,
  })
  trial_interval_unit: SubscriptionIntervalUnit;

  @Prop({ type: Number, required: true })
  trial_interval_count: number;

  @Prop({ Type: String, required: true })
  stripe_price_id: string;

  @Prop({ Type: String, required: false })
  paypal_plan_id: string;

  @Prop({ Type: String, required: false })
  paypal_plan_without_trial_id: string;

  @Prop({
    type: String,
    enum: ['day', 'week', 'month', 'year'],
    required: true,
  })
  interval_unit: SubscriptionIntervalUnit;

  @Prop({ type: Number, required: true })
  interval_count: number;

  @Prop({ type: String })
  name: string;

  @Prop({ type: String })
  description: string;

  @Prop({ Type: Number, required: true })
  price: number;
}

export const SubscriptionPlanSchema =
  SchemaFactory.createForClass(SubscriptionPlan);

SubscriptionPlanSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: SubscriptionPlanDocument = ret as SubscriptionPlanDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

SubscriptionPlanSchema.set('toJSON', { ...serializationCfg });
