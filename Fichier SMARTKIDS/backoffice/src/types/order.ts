export enum OrderTypeEnum {
  RIDE = 'ride',
  SUBSCRIPTION = 'subscription',
}

export const PAYMENT_TYPES = [OrderTypeEnum.RIDE, OrderTypeEnum.SUBSCRIPTION];

export enum OrderStatusTypeEnum {
  PENDING = 'pending',
  PAID = 'validated',
}

export const PAYMENT_STATUS_TYPES = [
  OrderStatusTypeEnum.PENDING,
  OrderStatusTypeEnum.PAID,
];

export interface Order {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  number: number;
  type: OrderTypeEnum;
  ref: string;
  invoice: string | null;
  context: string | null;
  status: OrderStatusTypeEnum;
}
