import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BatteryCharging, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { ScheduleModeSelector, type ScheduleMode } from "@/components/schedule/ScheduleModeSelector";
import { DaySelector, type DayKey } from "@/components/schedule/DaySelector";
import { TimeRangePicker } from "@/components/schedule/TimeRangePicker";
import { IndividualDaySchedule, type IndividualSchedule } from "@/components/schedule/IndividualDaySchedule";
import { ScheduleSummary } from "@/components/schedule/ScheduleSummary";
import { toast } from "sonner";

interface ChargingScheduleProps {
  onBack: () => void;
}

export default function ChargingSchedule({ onBack }: ChargingScheduleProps) {
  const [mode, setMode] = useState<ScheduleMode>("days-only");
  const [selectedDays, setSelectedDays] = useState<DayKey[]>([]);
  const [globalTimeRange, setGlobalTimeRange] = useState({ start: "21:00", end: "06:00" });
  const [individualSchedules, setIndividualSchedules] = useState<IndividualSchedule[]>([]);

  const handleToggleDay = (day: DayKey) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleAddSchedule = (schedule: IndividualSchedule) => {
    setIndividualSchedules((prev) => [...prev, schedule]);
  };

  const handleUpdateSchedule = (index: number, schedule: IndividualSchedule) => {
    setIndividualSchedules((prev) =>
      prev.map((s, i) => (i === index ? schedule : s))
    );
  };

  const handleRemoveSchedule = (index: number) => {
    setIndividualSchedules((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = () => {
    // Here we would save to backend/localStorage
    toast.success("Laddschemat har sparats!", {
      description: "Dina inställningar är nu aktiva.",
    });
    onBack();
  };

  const handleModeChange = (newMode: ScheduleMode) => {
    setMode(newMode);
    // Reset selections when changing modes
    if (newMode === "individual-times") {
      setSelectedDays([]);
    } else {
      setIndividualSchedules([]);
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-2">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
            <BatteryCharging className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-semibold">Laddschema</h1>
            <p className="text-xs text-muted-foreground">Schemalägg laddning till bilen</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {/* Mode Selector */}
        <GlassCard variant="subtle" className="p-3">
          <ScheduleModeSelector mode={mode} onModeChange={handleModeChange} />
        </GlassCard>

        {/* Mode-specific content */}
        <AnimatePresence mode="wait">
          {mode === "days-only" && (
            <motion.div
              key="days-only"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard variant="subtle" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Vilka dagar vill du ladda?</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Välj de dagar bilen ska laddas
                  </p>
                  <DaySelector selectedDays={selectedDays} onToggleDay={handleToggleDay} />
                </div>
              </GlassCard>
            </motion.div>
          )}

          {mode === "days-with-time" && (
            <motion.div
              key="days-with-time"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <GlassCard variant="subtle" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Välj dagar</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Samma tid gäller för alla valda dagar
                  </p>
                  <DaySelector selectedDays={selectedDays} onToggleDay={handleToggleDay} />
                </div>
              </GlassCard>

              <TimeRangePicker
                startTime={globalTimeRange.start}
                endTime={globalTimeRange.end}
                onStartTimeChange={(time) =>
                  setGlobalTimeRange((prev) => ({ ...prev, start: time }))
                }
                onEndTimeChange={(time) =>
                  setGlobalTimeRange((prev) => ({ ...prev, end: time }))
                }
                label="Laddtid för alla valda dagar"
              />
            </motion.div>
          )}

          {mode === "individual-times" && (
            <motion.div
              key="individual-times"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard variant="subtle" className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Individuella tider</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Ställ in unik laddtid för varje dag
                  </p>
                  <IndividualDaySchedule
                    schedules={individualSchedules}
                    onAddSchedule={handleAddSchedule}
                    onUpdateSchedule={handleUpdateSchedule}
                    onRemoveSchedule={handleRemoveSchedule}
                  />
                </div>
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary */}
        <ScheduleSummary
          mode={mode}
          selectedDays={selectedDays}
          globalTimeRange={globalTimeRange}
          individualSchedules={individualSchedules}
        />
      </div>

      {/* Save Button */}
      <div className="p-4 pt-2">
        <Button
          onClick={handleSave}
          className="w-full gap-2 h-12 text-base rounded-xl"
          size="lg"
        >
          <Save className="w-5 h-5" />
          Spara schema
        </Button>
      </div>
    </div>
  );
}
