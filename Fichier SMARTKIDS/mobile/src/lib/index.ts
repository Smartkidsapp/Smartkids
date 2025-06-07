import { formatDistanceToNowStrict, formatDuration } from "date-fns";
import { fr } from "date-fns/locale";
import { Linking } from "react-native";

export function openLink(link: string) {
  Linking.openURL(link).catch();
}

export function getMonthNameFromDate(date: Date) {
  const monthIdx = date.getMonth();
  const MONTHS = [
    "Janvier",
    "Février",
    "Mars",
    "Avril",
    "Mai",
    "Juin",
    "Juillet",
    "Août",
    "Septembre",
    "Octobre",
    "Novembre",
    "Décembre",
  ];

  return MONTHS[monthIdx];
}

const priceFmt = new Intl.NumberFormat("fr-FR", {
  currency: "EUR",
  style: "currency",
});

export function formatCurrency(price: number) {
  return priceFmt.format(price);
}

const numberFmt = new Intl.NumberFormat("fr-FR", {
  minimumIntegerDigits: 2,
});

export function formatNumber(n: number) {
  return numberFmt.format(n);
}

export function formatDurationSeconds(durationSeconds: number) {
  return formatDuration(
    {
      seconds: durationSeconds % 60,
      minutes: Math.floor((durationSeconds % (60 * 60)) / 60),
      hours: Math.floor(durationSeconds / 3600),
    },
    {
      locale: fr,
      format: ["hours", "minutes", "seconds"],
    }
  )
    .replace("secondes", "sec")
    .replace("minutes", "min")
    .replace("heures", "h")
    .replace("heure", "h");
}

export const formatDistanceShort = (date: Date | number): string => {
  return formatDistanceToNowStrict(date, {
    addSuffix: true,
    roundingMethod: "floor",
    locale: {
      formatDistance: (token, count) => {
        switch (token) {
          case "xSeconds":
            return count + "s";
          case "xMinutes":
            return count + "m";
          case "xHours":
            return count + "h";
          case "xDays":
            return count + "j";
          case "xMonths":
            return count + "mo";
          case "xYears":
            return count + "ans";
          default:
            return "";
        }
      },
    },
  });
};
