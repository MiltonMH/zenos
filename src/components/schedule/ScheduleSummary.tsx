import { motion } from "framer-motion";
import { BatteryCharging, Calendar, Clock } from "lucide-react";
import { type ScheduleMode } from "./ScheduleModeSelector";
import { days, type DayKey } from "./DaySelector";
import { type IndividualSchedule } from "./IndividualDaySchedule";
import { cn } from "@/lib/utils";

interface ScheduleSummaryProps {
  mode: ScheduleMode;
  selectedDays: DayKey[];
  globalTimeRange: { start: string; end: string };
  individualSchedules: IndividualSchedule[];
}

export function ScheduleSummary({
  mode,
  selectedDays,
  globalTimeRange,
  individualSchedules,
}: ScheduleSummaryProps) {
  const getDayLabel = (key: DayKey) => days.find((d) => d.key === key)?.label || key;
  const getShortLabel = (key: DayKey) => days.find((d) => d.key === key)?.short || key;

  const renderSummary = () => {
    switch (mode) {
      case "days-only":
        if (selectedDays.length === 0) {
          return (
            <p className="text-muted-foreground text-sm">
              Välj dagar för att schemalägga laddning
            </p>
          );
        }
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">
                Laddar: {selectedDays.map(getShortLabel).join(", ")}
              </span>
            </div>
          </div>
        );

      case "days-with-time":
        if (selectedDays.length === 0) {
          return (
            <p className="text-muted-foreground text-sm">
              Välj dagar och tid för laddning
            </p>
          );
        }
        return (
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span className="text-sm">
                {selectedDays.map(getShortLabel).join(", ")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" />
              <span className="text-sm">
                kl {globalTimeRange.start}–{globalTimeRange.end}
              </span>
            </div>
          </div>
        );

      case "individual-times":
        if (individualSchedules.length === 0) {
          return (
            <p className="text-muted-foreground text-sm">
              Lägg till dagar med individuella tider
            </p>
          );
        }
        return (
          <div className="space-y-1.5">
            {individualSchedules.map((schedule) => (
              <div key={schedule.day} className="flex items-center gap-2 text-sm">
                <BatteryCharging className="w-3.5 h-3.5 text-primary" />
                <span className="font-medium">{getShortLabel(schedule.day)}</span>
                <span className="text-muted-foreground">
                  {schedule.start}–{schedule.end}
                </span>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="glass-subtle rounded-xl p-4"
    >
      <h4 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">
        Sammanfattning
      </h4>
      {renderSummary()}
    </motion.div>
  );
}
