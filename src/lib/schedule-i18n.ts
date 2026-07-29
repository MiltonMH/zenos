import { getStoredLanguage, type AppLanguage } from "@/lib/i18n";

const scheduleTexts = {
  sv: {
    days: {
      mon: { label: "Måndag", short: "Mån", letter: "M" },
      tue: { label: "Tisdag", short: "Tis", letter: "T" },
      wed: { label: "Onsdag", short: "Ons", letter: "O" },
      thu: { label: "Torsdag", short: "Tor", letter: "T" },
      fri: { label: "Fredag", short: "Fre", letter: "F" },
      sat: { label: "Lördag", short: "Lör", letter: "L" },
      sun: { label: "Söndag", short: "Sön", letter: "S" },
    },
    modalTitle: "Laddschema",
    selectDays: "Välj dagar",
    chargeTime: "Laddtid",
    summary: "Laddar {days} kl {start}–{end}",
    toastSaved: "Schema sparat!",
    toastFailed: "Kunde inte spara schemat",
    toastNoVehicle: "Ingen bil kopplad — schemat sparas inte",
    loading: "Hämtar schema…",
  },
  en: {
    days: {
      mon: { label: "Monday", short: "Mon", letter: "M" },
      tue: { label: "Tuesday", short: "Tue", letter: "T" },
      wed: { label: "Wednesday", short: "Wed", letter: "W" },
      thu: { label: "Thursday", short: "Thu", letter: "T" },
      fri: { label: "Friday", short: "Fri", letter: "F" },
      sat: { label: "Saturday", short: "Sat", letter: "S" },
      sun: { label: "Sunday", short: "Sun", letter: "S" },
    },
    modalTitle: "Charging schedule",
    selectDays: "Select days",
    chargeTime: "Charging time",
    summary: "Charging {days} at {start}–{end}",
    toastSaved: "Schedule saved!",
    toastFailed: "Could not save schedule",
    toastNoVehicle: "No vehicle linked — schedule not saved",
    loading: "Loading schedule…",
  },
} as const;

export type ScheduleTexts = (typeof scheduleTexts)[AppLanguage];

export function getScheduleTexts(
  language: AppLanguage = getStoredLanguage(),
): ScheduleTexts {
  return scheduleTexts[language];
}
