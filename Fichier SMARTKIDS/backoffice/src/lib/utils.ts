import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function initial(name: string) {
  return name
    .split(" ")
    .map((part) => (part ? part[0].toLocaleUpperCase() : ""))
    .join("");
}

const formatter = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  style: "currency",
});
export function formatPrice(price: number) {
  return formatter.format(price);
}

const numformatter = new Intl.NumberFormat("fr-FR");
export function formatNUmber(number: number) {
  return numformatter.format(number);
}
