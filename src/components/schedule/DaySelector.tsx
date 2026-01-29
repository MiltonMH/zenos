import { motion, AnimatePresence } from "framer-motion";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

export type DayKey = "mon" | "tue" | "wed" | "thu" | "fri" | "sat" | "sun";

interface DaySelectorProps {
  selectedDays: DayKey[];
  onToggleDay: (day: DayKey) => void;
  showLabels?: boolean;
}

const days: { key: DayKey; label: string; short: string; letter: string }[] = [
  { key: "mon", label: "Måndag", short: "Mån", letter: "M" },
  { key: "tue", label: "Tisdag", short: "Tis", letter: "T" },
  { key: "wed", label: "Onsdag", short: "Ons", letter: "O" },
  { key: "thu", label: "Torsdag", short: "Tor", letter: "T" },
  { key: "fri", label: "Fredag", short: "Fre", letter: "F" },
  { key: "sat", label: "Lördag", short: "Lör", letter: "L" },
  { key: "sun", label: "Söndag", short: "Sön", letter: "S" },
];

export function DaySelector({ selectedDays, onToggleDay, showLabels = true }: DaySelectorProps) {
  return (
    <div className="space-y-2">
      {showLabels && (
        <div className="flex justify-between px-1 text-[10px] text-muted-foreground">
          {days.map((day) => (
            <span key={day.key} className="w-10 text-center">{day.short}</span>
          ))}
        </div>
      )}
      
      <div className="flex justify-between gap-1.5">
        {days.map((day) => {
          const isSelected = selectedDays.includes(day.key);
          
          return (
            <motion.button
              key={day.key}
              onClick={() => onToggleDay(day.key)}
              className={cn(
                "relative w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all",
                isSelected
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-white/40 text-foreground/70 hover:bg-white/60 border-2 border-dashed border-muted-foreground/20"
              )}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <AnimatePresence mode="wait">
                {isSelected ? (
                  <motion.div
                    key="check"
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 90 }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-center"
                  >
                    <Check className="w-5 h-5" strokeWidth={3} />
                  </motion.div>
                ) : (
                  <motion.span
                    key="label"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    {day.letter}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
      
      {/* Selection hint */}
      <p className="text-[11px] text-center text-muted-foreground mt-2">
        {selectedDays.length === 0 
          ? "Tryck på dagarna du vill ladda" 
          : `${selectedDays.length} ${selectedDays.length === 1 ? "dag" : "dagar"} valda`}
      </p>
    </div>
  );
}

export { days };
