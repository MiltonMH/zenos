import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

interface DaySelectorProps {
  selectedDays: DayKey[];
  onToggleDay: (day: DayKey) => void;
}

const days: { key: DayKey; label: string; short: string }[] = [
  { key: "mon", label: "Måndag", short: "Mån" },
  { key: "tue", label: "Tisdag", short: "Tis" },
  { key: "wed", label: "Onsdag", short: "Ons" },
  { key: "thu", label: "Torsdag", short: "Tor" },
  { key: "fri", label: "Fredag", short: "Fre" },
  { key: "sat", label: "Lördag", short: "Lör" },
  { key: "sun", label: "Söndag", short: "Sön" },
];

export function DaySelector({ selectedDays, onToggleDay }: DaySelectorProps) {
  return (
    <div className="flex justify-between gap-2">
      {days.map((day) => {
        const isSelected = selectedDays.includes(day.key);
        
        return (
          <motion.button
            key={day.key}
            onClick={() => onToggleDay(day.key)}
            className={cn(
              "relative w-11 h-11 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
              isSelected
                ? "bg-primary text-primary-foreground glow-primary"
                : "bg-white/30 text-muted-foreground hover:bg-white/50"
            )}
            whileTap={{ scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <AnimatePresence mode="wait">
              {isSelected ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              ) : (
                <motion.span
                  key="label"
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  {day.short}
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        );
      })}
    </div>
  );
}

export { days };
