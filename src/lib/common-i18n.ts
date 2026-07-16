import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const commonTexts = {
  sv: {
    back: "Tillbaka",
    continue: "Fortsätt",
    save: "Spara",
    next: "Nästa",
    edit: "Redigera",
    logOut: "Logga ut",
    version: "Version",
    auto: "Auto",
    selectPlaceholder: "Välj…",
    creating: "Ett ögonblick…",
  },
  en: {
    back: "Back",
    continue: "Continue",
    save: "Save",
    next: "Next",
    edit: "Edit",
    logOut: "Log out",
    version: "Version",
    auto: "Auto",
    selectPlaceholder: "Select…",
    creating: "Just a moment…",
  },
} as const;

export type CommonTexts = (typeof commonTexts)[AppLanguage];

export function getCommonTexts(
  language: AppLanguage = getStoredLanguage(),
): CommonTexts {
  return commonTexts[language];
}
