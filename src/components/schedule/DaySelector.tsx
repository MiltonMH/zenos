import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { getScheduleTexts } from "@/lib/schedule-i18n";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

interface DaySelectorProps {
  selectedDays: DayKey[];
  onToggleDay: (day: DayKey) => void;
  showLabels?: boolean;
}

const DAY_KEYS: DayKey[] = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"];

export function DaySelector({ selectedDays, onToggleDay, showLabels = false }: DaySelectorProps) {
  const { language } = useLanguage();
  const schedule = getScheduleTexts(language);
  const days = DAY_KEYS.map((key) => ({
    key,
    label: schedule.days[key].label,
    short: schedule.days[key].short,
    letter: schedule.days[key].letter,
  }));

  return (
    <div className="flex justify-between gap-1">
      {days.map((day) => {
        const isSelected = selectedDays.includes(day.key);
        
        return (
          <motion.button
            key={day.key}
            onClick={() => onToggleDay(day.key)}
            className={cn(
              "relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all",
              isSelected
                ? "bg-primary text-primary-foreground"
                : "bg-muted/50 text-muted-foreground hover:bg-muted"
            )}
            whileTap={{ scale: 0.9 }}
            aria-label={showLabels ? day.label : undefined}
          >
            <AnimatePresence mode="wait">
              {isSelected ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-4 h-4" strokeWidth={3} />
                </motion.div>
              ) : (
                <motion.span
                  key="label"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {day.letter}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}
