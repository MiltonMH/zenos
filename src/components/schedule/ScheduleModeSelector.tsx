import { motion } from "framer-motion";
import { Calendar, Clock, Settings2 } from "lucide-react";
import { cn } from "@/lib/utils";

export type ScheduleMode = "days-only" | "days-with-time" | "individual-times";

interface ScheduleModeSelectorProps {
  mode: ScheduleMode;
  onModeChange: (mode: ScheduleMode) => void;
}

const modes: { value: ScheduleMode; label: string; description: string; icon: typeof Calendar }[] = [
  { value: "days-only", label: "Enkel", description: "Bara dagar", icon: Calendar },
  { value: "days-with-time", label: "Standard", description: "Dagar + tid", icon: Clock },
  { value: "individual-times", label: "Avancerat", description: "Egen tid per dag", icon: Settings2 },
];

export function ScheduleModeSelector({ mode, onModeChange }: ScheduleModeSelectorProps) {
  return (
    <div className="space-y-3">
      <div className="text-center">
        <h3 className="text-sm font-medium text-foreground">Välj typ av schema</h3>
        <p className="text-xs text-muted-foreground mt-0.5">Hur detaljerat vill du styra laddningen?</p>
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = mode === m.value;
          
          return (
            <motion.button
              key={m.value}
              onClick={() => onModeChange(m.value)}
              className={cn(
                "relative p-3 rounded-xl text-center transition-all",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg"
                  : "bg-white/40 text-muted-foreground hover:bg-white/60"
              )}
              whileTap={{ scale: 0.97 }}
            >
              <Icon className={cn("w-5 h-5 mx-auto mb-1.5", isActive ? "text-primary-foreground" : "text-primary")} />
              <div className={cn("text-xs font-semibold", isActive && "text-primary-foreground")}>{m.label}</div>
              <div className={cn("text-[10px] mt-0.5", isActive ? "text-primary-foreground/80" : "text-muted-foreground")}>
                {m.description}
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
