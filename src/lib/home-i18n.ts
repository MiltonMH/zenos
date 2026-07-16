import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const homeTexts = {
  sv: {
    greeting: "Hej, {name}",
    ariaOpenSettings: "Öppna inställningar",
    ariaPreviousSlide: "Föregående slide",
    ariaNextSlide: "Nästa slide",

    lock: {
      label: "Lås",
      locked: "Låst",
      unlocked: "Olåst",
    },
    mode: {
      label: "Läge",
      idle: "Idle",
      charging: "Ladda",
      v2h: "V2H",
      v2g: "V2G",
      disconnected: "Offline",
    },
    schedule: {
      label: "Schema",
      sublabel: "Auto",
    },
    alt: {
      charger: "ZenBox Charger",
    },

    period: {
      D: "Idag",
      V: "Denna vecka",
      M: "Denna månad",
      Å: "Detta år",
    },
    stat: {
      charged: "Laddat",
      v2h: "V2H",
      cost: "Kostnad",
    },
    unit: {
      kWh: "kWh",
      kr: "kr",
      kW: "kW",
      krPerKwh: "kr/kWh",
      sekPerKwh: "SEK/kWh",
    },

    energyPrice: {
      title: "Elpris idag",
      tabToday: "idag",
      tabTomorrow: "imorgon",
      lowest: "Lägst",
      highest: "Högst",
      atTime: "kl {time}",
      justNow: "Just nu",
    },

    energyFlow: {
      modeCharging: "Laddar",
      modeV2h: "Vehicle-to-Home",
      modeV2g: "Vehicle-to-Grid",
      altHouse: "Hus",
      altGrid: "Elnät",
      altCar: "Volvo EX30",
    },

    scheduleCard: {
      title: "Smart Schema",
      aiOptimized: "AI Optimerat",
      nextAction: "Nästa åtgärd",
      actionCharge: "Ladda",
      actionV2h: "V2H",
      actionIdle: "Vänta",
      viewFull: "Se hela schemat",
      currency: "SEK",
    },

    spotPrice: {
      title: "Elpris just nu",
      priceLow: "Lågt pris",
      priceMedium: "Normalt pris",
      priceHigh: "Högt pris",
      trendUp: "Stigande",
      trendDown: "Fallande",
      trendStable: "Stabilt",
      nextHour: "Nästa timme: ",
      bestTime: "Bäst tid: ",
    },

    energyFlowCard: {
      title: "Energiflöde",
      nodeGrid: "Elnät",
      nodeCar: "Bil",
      nodeHome: "Hem",
    },
  },
  en: {
    greeting: "Hi, {name}",
    ariaOpenSettings: "Open settings",
    ariaPreviousSlide: "Previous slide",
    ariaNextSlide: "Next slide",

    lock: {
      label: "Lock",
      locked: "Locked",
      unlocked: "Unlocked",
    },
    mode: {
      label: "Mode",
      idle: "Idle",
      charging: "Charge",
      v2h: "V2H",
      v2g: "V2G",
      disconnected: "Offline",
    },
    schedule: {
      label: "Schedule",
      sublabel: "Auto",
    },
    alt: {
      charger: "ZenBox Charger",
    },

    period: {
      D: "Today",
      V: "This week",
      M: "This month",
      Å: "This year",
    },
    stat: {
      charged: "Charged",
      v2h: "V2H",
      cost: "Cost",
    },
    unit: {
      kWh: "kWh",
      kr: "SEK",
      kW: "kW",
      krPerKwh: "SEK/kWh",
      sekPerKwh: "SEK/kWh",
    },

    energyPrice: {
      title: "Electricity price today",
      tabToday: "today",
      tabTomorrow: "tomorrow",
      lowest: "Lowest",
      highest: "Highest",
      atTime: "at {time}",
      justNow: "Right now",
    },

    energyFlow: {
      modeCharging: "Charging",
      modeV2h: "Vehicle-to-Home",
      modeV2g: "Vehicle-to-Grid",
      altHouse: "House",
      altGrid: "Grid",
      altCar: "Volvo EX30",
    },

    scheduleCard: {
      title: "Smart Schedule",
      aiOptimized: "AI Optimized",
      nextAction: "Next action",
      actionCharge: "Charge",
      actionV2h: "V2H",
      actionIdle: "Wait",
      viewFull: "See full schedule",
      currency: "SEK",
    },

    spotPrice: {
      title: "Electricity price now",
      priceLow: "Low price",
      priceMedium: "Normal price",
      priceHigh: "High price",
      trendUp: "Rising",
      trendDown: "Falling",
      trendStable: "Stable",
      nextHour: "Next hour: ",
      bestTime: "Best time: ",
    },

    energyFlowCard: {
      title: "Energy flow",
      nodeGrid: "Grid",
      nodeCar: "Car",
      nodeHome: "Home",
    },
  },
} as const;

export type HomeTexts = (typeof homeTexts)[AppLanguage];

export function getHomeTexts(
  language: AppLanguage = getStoredLanguage(),
): HomeTexts {
  return homeTexts[language];
}
