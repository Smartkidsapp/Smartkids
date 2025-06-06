import { formatCurrency } from "./SubscriptionPage";

export default function SubscriptionPriceBreakdown({ plan }) {

    const { price, taxAmount, totalPrice } = getSubscriptionPlanPriceBreakdown(plan);

    console.log(plan);

    return (
        <div className="price-details">
            <div className="d-flex justify-content-between">
                <span className="m-0">Prix</span>
                <span className="m-0">{formatCurrency(price)}</span>
            </div>
            <div className="d-flex justify-content-between">
                <span className="m-0">TVA</span>
                <span className="m-0">{formatCurrency(0)}</span>
            </div>
            <div className="d-flex justify-content-between">
                <strong className="m-0">Total</strong>
                <strong className="m-0">{formatCurrency(price)}</strong>
            </div>
        </div>
    );
}

function calculateTax(
    price,
    taxRate = 20
) {
    const taxAmount = price * (taxRate / 100);
    const totalPrice = price + taxAmount;
    return { taxAmount, totalPrice };
}

export const getSubscriptionPlanPriceBreakdown = (plan) => {
    const price = plan.price;
    const { taxAmount, totalPrice } = calculateTax(price);

    return {
        price,
        taxAmount,
        totalPrice,
    };
};