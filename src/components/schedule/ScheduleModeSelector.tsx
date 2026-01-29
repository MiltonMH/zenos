import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export type ScheduleMode = "days-only" | "days-with-time" | "individual-times";

interface ScheduleModeSelectorProps {
  mode: ScheduleMode;
  onModeChange: (mode: ScheduleMode) => void;
}

const modes: { value: ScheduleMode; label: string }[] = [
  { value: "days-only", label: "Dagar" },
  { value: "days-with-time", label: "Dagar + Tid" },
  { value: "individual-times", label: "Individuellt" },
];

export function ScheduleModeSelector({ mode, onModeChange }: ScheduleModeSelectorProps) {
  return (
    <div className="pill-toggle w-full">
      {modes.map((m) => (
        <button
          key={m.value}
          onClick={() => onModeChange(m.value)}
          className={cn(
            "pill-toggle-item flex-1 relative",
            mode === m.value && "active"
          )}
        >
          {mode === m.value && (
            <motion.div
              layoutId="activeMode"
              className="absolute inset-0 bg-white rounded-full shadow-sm"
              transition={{ type: "spring", bounce: 0.2, duration: 0.4 }}
            />
          )}
          <span className="relative z-10">{m.label}</span>
        </button>
      ))}
    </div>
  );
}
