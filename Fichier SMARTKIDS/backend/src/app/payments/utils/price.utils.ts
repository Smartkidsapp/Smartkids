export const APP_FEES_PERCENT = 0.05;
export const TAV_PERCENT = 0.1;

export function getRidePriceBreakdown(ride: any) {
  const tax = TAV_PERCENT * ride.price;
  const total = ride.price;
  const price = ride.price - tax;

  return {
    total,
    tax,
    price,
  };
}

export function getSubscriptionPriceBreakdown(total: number) {
  const tax = TAV_PERCENT * total;
  const price = total - tax;

  return {
    price: price,
    tax,
    total,
  };
}
