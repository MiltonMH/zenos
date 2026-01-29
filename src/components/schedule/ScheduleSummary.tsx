import { motion } from "framer-motion";
import { Zap, CheckCircle2 } from "lucide-react";
import { type ScheduleMode } from "./ScheduleModeSelector";
import { days, type DayKey } from "./DaySelector";
import { type IndividualSchedule } from "./IndividualDaySchedule";

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
  const getShortLabel = (key: DayKey) => days.find((d) => d.key === key)?.short || key;

  const renderContent = () => {
    switch (mode) {
      case "days-only":
        return (
          <div className="text-sm">
            <span className="text-muted-foreground">Bilen laddas varje </span>
            <span className="font-semibold text-foreground">
              {selectedDays.map(getShortLabel).join(", ")}
            </span>
          </div>
        );

      case "days-with-time":
        return (
          <div className="text-sm space-y-1">
            <div>
              <span className="text-muted-foreground">Laddning </span>
              <span className="font-semibold text-foreground">
                {selectedDays.map(getShortLabel).join(", ")}
              </span>
            </div>
            <div>
              <span className="text-muted-foreground">mellan </span>
              <span className="font-semibold text-primary">
                {globalTimeRange.start}
              </span>
              <span className="text-muted-foreground"> och </span>
              <span className="font-semibold text-primary">
                {globalTimeRange.end}
              </span>
            </div>
          </div>
        );

      case "individual-times":
        return (
          <div className="space-y-1.5">
            {individualSchedules.map((schedule) => (
              <div key={schedule.day} className="flex items-center justify-between text-sm">
                <span className="font-medium">{getShortLabel(schedule.day)}</span>
                <span className="text-primary font-semibold">
                  {schedule.start} → {schedule.end}
                </span>
              </div>
            ))}
          </div>
        );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="rounded-xl p-4 bg-success/10 border border-success/30"
    >
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
          <CheckCircle2 className="w-5 h-5 text-success" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-semibold text-foreground mb-1">
            Redo att spara
          </h4>
          {renderContent()}
        </div>
      </div>
    </motion.div>
  );
}
