import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const notFoundTexts = {
  sv: {
    title: "404",
    message: "Hoppsan! Sidan hittades inte",
    backHome: "Tillbaka till hem",
  },
  en: {
    title: "404",
    message: "Oops! Page not found",
    backHome: "Return to Home",
  },
} as const;

export type NotFoundTexts = (typeof notFoundTexts)[AppLanguage];

export function getNotFoundTexts(
  language: AppLanguage = getStoredLanguage(),
): NotFoundTexts {
  return notFoundTexts[language];
}
