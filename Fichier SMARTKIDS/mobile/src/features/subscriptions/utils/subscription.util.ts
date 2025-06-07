import {
  SubscriptionIntervalUnit,
  SubscriptionPlan,
} from "@/src/types/subscription-plan.types";
import { useTranslation } from "react-i18next";

export const formatSubscriptionReccurence = (
  unit: SubscriptionIntervalUnit,
  count: number,
  style: "long" | "short" = "long"
) => {
  const { t } = useTranslation();
  let text;
  switch (unit) {
    case "day":
      text = count === 1 ? t('jour') : `${count} ${t('jour')}s`;
      break;
    case "week":
      text = count === 1 ? t('semaine') : `${count} ${t('semaine')}s`;
      break;
    case "month":
      text = count === 1 ? t('mois') : `${count} ${t('mois_en')}`;
      break;
    case "year":
      text = count === 1 ? t('an') : `${count} ${t('an')}s`;
      break;
  }

  if (style === "long" && count > 1) {
    text = `chaque ${text}`;
  } else if (style === "short" && count > 1) {
    text = `par ${text}`;
  }

  return text;
};

export const getSubscriptionPlanPriceBreakdown = (plan: SubscriptionPlan) => {
  const price = plan.price;
  const { taxAmount, totalPrice } = calculateTax(price);

  return {
    price,
    taxAmount,
    totalPrice,
  };
};

/**
 * Calculates the tax amount and total price including tax.
 * @param price - The original price of the item.
 * @param taxRate - The tax rate as a percentage.
 * @returns An object containing the tax amount and the total price including tax.
 */
function calculateTax(
  price: number,
  taxRate: number = 20
): { taxAmount: number; totalPrice: number } {
  const taxAmount = price * (taxRate / 100);
  const totalPrice = price + taxAmount;
  return { taxAmount, totalPrice };
}
