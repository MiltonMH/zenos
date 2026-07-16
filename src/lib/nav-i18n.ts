import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const navTexts = {
  sv: {
    home: "Hem",
    statistics: "Statistik",
    profile: "Profil",
    charging: "Ladda",
    schedule: "Schema",
    settings: "Inställningar",
    dash: "Dash",
    ariaShowSlide: "Visa {slide}",
  },
  en: {
    home: "Home",
    statistics: "Statistics",
    profile: "Profile",
    charging: "Charge",
    schedule: "Schedule",
    settings: "Settings",
    dash: "Dash",
    ariaShowSlide: "Show {slide}",
  },
} as const;

export type NavTexts = (typeof navTexts)[AppLanguage];

export function getNavTexts(
  language: AppLanguage = getStoredLanguage(),
): NavTexts {
  return navTexts[language];
}
