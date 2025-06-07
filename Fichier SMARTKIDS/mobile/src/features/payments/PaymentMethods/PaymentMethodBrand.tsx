import React from "react";
import VisaIcon from "@/assets/icons/card-icons/visa.svg";
import { Image } from "@gluestack-ui/themed";

const LOGO = {
  amex: require("@/assets/icons/card-icons/amex.png"),
  mastercard: require("@/assets/icons/card-icons/mastercard.png"),
  eftpos_au: require("@/assets/icons/card-icons/eftpos_au.png"),
  discover: require("@/assets/icons/card-icons/discover.png"),
  jcb: require("@/assets/icons/card-icons/jcb.png"),
  unionpay: require("@/assets/icons/card-icons/unionpay.png"),
  diners: require("@/assets/icons/card-icons/diners.png"),
};

export default function PaymentMethodBrand({
  brand,
}: {
  brand:
    | "amex"
    | "visa"
    | "mastercard"
    | "eftpos_au"
    | "discover"
    | "jcb"
    | "unionpay"
    | "diners"
    | "unknown";
}) {
  if (brand === "visa" || brand === "unknown") {
    return <VisaIcon height={30} width={30} />;
  }

  return (
    <Image
      width={30}
      height={30}
      source={LOGO[brand]}
      alt={brand}
      resizeMethod="resize"
      resizeMode="contain"
    />
  );
}
