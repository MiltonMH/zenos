import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const settingsTexts = {
  sv: {
    title: "Inställningar",
    tabCharging: "Laddning",
    tabV2x: "V2X",

    save: {
      saving: "Sparar…",
      errorTitle: "Kunde inte spara",
      failed: "Inställningarna sparades inte. Försök igen.",
      forbidden: "Du har inte behörighet att ändra laddinställningar.",
      unauthorized: "Sessionen har gått ut — logga in igen.",
      unknownVehicle:
        "SoC och V2X kan inte ändras för okänd bil. Anslut en känd bil först.",
    },

    status: {
      title: "Status & Laddning",
      statusLabel: "Status:",
      charging: "Laddar",
      idle: "Idle",
      v2h: "V2H",
      v2g: "V2G",
      searching: "Söker WiFi",
      error: "Error",
      unknown: "Okänd",
      versionLabel: "Version:",
      restartCharger: "Starta om laddbox",
      restartTitle: "Starta om",
      restartNotReady: "Omstart är inte tillgänglig ännu (kommer snart).",
      maxChargeLevel: "Max laddningsnivå",
      maxChargeHint: "Laddboxen laddar upp till {percent}%",
    },

    optimization: {
      title: "V2H & V2G",
      maxDischarge: "Max urladdning",
      neverDischargeBelow: "Laddar aldrig ur under",
      modeSavingsTitle: "Maximal Besparing",
      modeSavingsSubtitle: "Mest pengar • Mer slitage",
      modeBalancedTitle: "Balanserad",
      modeBalancedSubtitle: "Bra ekonomi • Skyddar batteriet",
      modeBalancedBadge: "REC",
      modeProtectionTitle: "Batteriskydd",
      modeProtectionSubtitle: "Längsta liv • Mindre V2X",
      warningBothOff: "V2H och V2G avstängda. Bilen laddar bara.",
      v2hTitle: "V2H - Hemmet",
      v2hSubtitle: "Ladda ur till hemmet",
      v2gTitle: "V2G - Elnätet",
      v2gSubtitle: "Sälj och tjäna pengar",
      v2gBadge: "PRO",
    },
  },
  en: {
    title: "Settings",
    tabCharging: "Charging",
    tabV2x: "V2X",

    save: {
      saving: "Saving…",
      errorTitle: "Could not save",
      failed: "Settings were not saved. Please try again.",
      forbidden: "You do not have permission to change charging settings.",
      unauthorized: "Session expired — please sign in again.",
      unknownVehicle:
        "SoC and V2X cannot be changed for an unknown vehicle. Connect a known car first.",
    },

    status: {
      title: "Status & Charging",
      statusLabel: "Status:",
      charging: "Charging",
      idle: "Idle",
      v2h: "V2H",
      v2g: "V2G",
      searching: "Searching for WiFi",
      error: "Error",
      unknown: "Unknown",
      versionLabel: "Version:",
      restartCharger: "Restart charger",
      restartTitle: "Restart",
      restartNotReady: "Restart is not available yet (coming soon).",
      maxChargeLevel: "Max charge level",
      maxChargeHint: "The charger charges up to {percent}%",
    },

    optimization: {
      title: "V2H & V2G",
      maxDischarge: "Max discharge",
      neverDischargeBelow: "Never discharges below",
      modeSavingsTitle: "Maximum Savings",
      modeSavingsSubtitle: "Most money • More wear",
      modeBalancedTitle: "Balanced",
      modeBalancedSubtitle: "Good value • Protects the battery",
      modeBalancedBadge: "REC",
      modeProtectionTitle: "Battery protection",
      modeProtectionSubtitle: "Longest life • Less V2X",
      warningBothOff: "V2H and V2G are off. The car only charges.",
      v2hTitle: "V2H - Home",
      v2hSubtitle: "Discharge to your home",
      v2gTitle: "V2G - Grid",
      v2gSubtitle: "Sell and earn money",
      v2gBadge: "PRO",
    },
  },
} as const;

export type SettingsTexts = (typeof settingsTexts)[AppLanguage];

export function getSettingsTexts(
  language: AppLanguage = getStoredLanguage(),
): SettingsTexts {
  return settingsTexts[language];
}
