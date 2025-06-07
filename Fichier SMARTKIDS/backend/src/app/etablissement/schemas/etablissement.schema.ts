import { Prop, raw, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { MediaDocument } from 'src/app/medias/schemas/media.schema';

export type EtablissementDocument = HydratedDocument<Etablissement>;

export type DayIndex = 0 | 1 | 2 | 3 | 4 | 5 | 6;

export interface DailyOpeningHours {
  day: DayIndex;
  available: boolean;
  from: string;
  to: string;
}

export interface Services {
  title: string;
  price: string;
}

@Schema()
export class Etablissement {
  _id: Types.ObjectId;

  id: string;
  
  createdAt: Date;
  
  updatedAt: Date;

  @Prop({ required: true, type: String })
  nom: string;

  @Prop({ required: true, type: String })
  description: string;

  @Prop({ required: false, type: String })
  code_promo: string;

  @Prop({ required: true, type: String })
  phone: string;

  @Prop({ required: false, type: Number, default: 0 })
  vue: number;

  @Prop({ required: false, type: Number, default: 0 })
  click: number;

  @Prop({ required: false, type: String })
  website: string;

  @Prop({ required: false, type: String })
  facebook: string;
  
  @Prop({ required: false, type: String })
  instagram: string;

  @Prop({ required: false, type: String })
  tiktok: string;

  @Prop({ required: false, type: String })
  linkedin: string;

  @Prop({ required: true, type: String })
  adresse: string;

  @Prop({ required: false, type: Number })
  longitude: number;

  @Prop({ required: false, type: Number })
  latitude: number;

  @Prop({ required: false, type: Number, default: 0 })
  min_age: number;

  @Prop({ required: false, type: Number, default: 99 })
  max_age: number;

  @Prop({ type: Types.ObjectId, required: true })
  userId: Types.ObjectId;

  @Prop({type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Media' }]})
  images: Types.ObjectId[];

  @Prop({ required: false, ref: 'Category', type: Types.ObjectId })
  category: Types.ObjectId;

  @Prop({type: [{ type: Types.ObjectId, ref: 'Option' }]})
  options: Types.ObjectId[];

  @Prop({
    required: false,
    default: [],
    type: [
      raw({
        from: { type: String, required: true },
        to: { type: String, required: true },
        day: { type: Number, required: true },
        available: { type: Boolean, required: true },
      }),
    ],
  })
  dailyOpeningHours: DailyOpeningHours[];

  @Prop({
    required: false,
    default: [],
    type: [
      raw({
        title: { type: String, required: true },
        price: { type: String, required: true },
      }),
    ],
  })
  services: Services[];
}

export const EtablissementSchema = SchemaFactory.createForClass(Etablissement);

EtablissementSchema.set('timestamps', true);

const serializationCfg = {
  getters: true,
  virtuals: true,
  transform: function (_, ret) {
    const item: EtablissementDocument = ret as EtablissementDocument;

    item.id = `${item._id}`;

    const services = item.services.map((service) => {
      return {title: service.title, price: service.price.toString()}
    });
    //@ts-ignore
    item.services = services;
    
    delete item._id;

    delete item.__v;

    return item;
  },
};

EtablissementSchema.set('toJSON', { ...serializationCfg });
EtablissementSchema.set('toObject', { ...serializationCfg });