import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const statisticsTexts = {
  sv: {
    title: "Statistik",
    period: {
      D: "Idag",
      W: "Denna vecka",
      M: "Denna månad",
      Y: "Detta år",
    },
    periodShort: {
      D: "D",
      W: "V",
      M: "M",
      Y: "Å",
    },
    stat: {
      charged: "Laddat",
      v2h: "V2H",
      cost: "Kostnad",
      avgPrice: "Snittpris",
    },
    chart: {
      energyTitle: "Energiförbrukning",
      costPerDay: "Kostnad per dag",
      costPerWeek: "Kostnad per vecka",
    },
    history: {
      title: "Laddningshistorik",
    },
    saved: "Sparat",
    unit: {
      kWh: "kWh",
      kr: "kr",
      krPerKwh: "kr/kWh",
    },
    alt: {
      charged: "Laddat",
      v2h: "V2H",
    },
    days: {
      mon: "Mån",
      tue: "Tis",
      wed: "Ons",
      thu: "Tor",
      fri: "Fre",
      sat: "Lör",
      sun: "Sön",
    },
    relative: {
      today: "Idag",
      yesterday: "Igår",
    },
  },
  en: {
    title: "Statistics",
    period: {
      D: "Today",
      W: "This week",
      M: "This month",
      Y: "This year",
    },
    periodShort: {
      D: "D",
      W: "W",
      M: "M",
      Y: "Y",
    },
    stat: {
      charged: "Charged",
      v2h: "V2H",
      cost: "Cost",
      avgPrice: "Avg. price",
    },
    chart: {
      energyTitle: "Energy use",
      costPerDay: "Cost per day",
      costPerWeek: "Cost per week",
    },
    history: {
      title: "Charging history",
    },
    saved: "Saved",
    unit: {
      kWh: "kWh",
      kr: "SEK",
      krPerKwh: "SEK/kWh",
    },
    alt: {
      charged: "Charged",
      v2h: "V2H",
    },
    days: {
      mon: "Mon",
      tue: "Tue",
      wed: "Wed",
      thu: "Thu",
      fri: "Fri",
      sat: "Sat",
      sun: "Sun",
    },
    relative: {
      today: "Today",
      yesterday: "Yesterday",
    },
  },
} as const;

export type StatisticsTexts = (typeof statisticsTexts)[AppLanguage];

export function getStatisticsTexts(
  language: AppLanguage = getStoredLanguage(),
): StatisticsTexts {
  return statisticsTexts[language];
}
