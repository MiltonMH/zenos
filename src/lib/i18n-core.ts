export const ZENOS_LANG_KEY = "zenos-lang";
export type AppLanguage = "sv" | "en";

export function getStoredLanguage(): AppLanguage {
  try {
    const stored =
      localStorage.getItem(ZENOS_LANG_KEY) ??
      localStorage.getItem("zenion-lang");
    const normalized = stored?.trim().toLowerCase();
    if (normalized === "en" || normalized === "english" || normalized?.startsWith("en-")) {
      return "en";
    }
  } catch {
    // Ignore storage errors.
  }
  return "sv";
}

export function formatMessage(
  template: string,
  vars: Record<string, string | number>,
): string {
  return Object.entries(vars).reduce(
    (text, [key, value]) => text.replaceAll(`{${key}}`, String(value)),
    template,
  );
}
