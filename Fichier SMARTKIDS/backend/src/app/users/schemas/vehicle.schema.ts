import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type VehicleDocument = HydratedDocument<Vehicle>;

@Schema()
export class Vehicle {
  _id: Types.ObjectId;
  id: string;
  createdAt: Date;
  updatedAt: Date;

  @Prop({ required: true, type: Types.ObjectId, ref: 'User', unique: true })
  user: Types.ObjectId;

  @Prop({ required: false, default: [], ref: 'Media', type: [Types.ObjectId] })
  photos: Types.ObjectId[];

  @Prop({ required: false, default: [], ref: 'Media', type: [Types.ObjectId] })
  vehicleCertificate: Types.ObjectId[];

  @Prop({ default: null, type: String })
  vehicleModel: string | null;

  @Prop({ default: 0, type: Number })
  seatsCount: number;

  @Prop({ default: null, type: Date })
  date: Date | null;

  @Prop({ default: null, type: String })
  plateNumber: string | null;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);

VehicleSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: VehicleDocument = ret as VehicleDocument;

    item.id = `${item._id}`;
    delete item._id;

    delete item.__v;

    return item;
  },
};

VehicleSchema.set('toJSON', { ...serializationCfg });
// VehicleSchema.set('toObject', { ...serializationCfg });
