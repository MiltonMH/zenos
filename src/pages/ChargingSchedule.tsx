import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, BatteryCharging, Save, Zap, Info } from "lucide-react";
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
    toast.success("Laddschemat har sparats!", {
      description: "Dina inställningar är nu aktiva.",
    });
    onBack();
  };

  const handleModeChange = (newMode: ScheduleMode) => {
    setMode(newMode);
    if (newMode === "individual-times") {
      setSelectedDays([]);
    } else {
      setIndividualSchedules([]);
    }
  };

  const canSave = 
    (mode === "individual-times" && individualSchedules.length > 0) ||
    (mode !== "individual-times" && selectedDays.length > 0);

  const getStepNumber = () => {
    if (mode === "individual-times") return null;
    return mode === "days-only" ? 1 : 2;
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-3 p-4 pb-3">
        <button
          onClick={onBack}
          className="p-2 -ml-2 rounded-full hover:bg-white/30 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-primary/20 flex items-center justify-center">
            <Zap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Laddschema</h1>
            <p className="text-xs text-muted-foreground">När ska bilen laddas?</p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4">
        {/* Step 1: Mode Selector */}
        <GlassCard variant="subtle" className="p-4">
          <ScheduleModeSelector mode={mode} onModeChange={handleModeChange} />
        </GlassCard>

        {/* Mode-specific content */}
        <AnimatePresence mode="wait">
          {mode === "days-only" && (
            <motion.div
              key="days-only"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard variant="subtle" className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Välj ladddagar</h3>
                </div>
                
                <DaySelector selectedDays={selectedDays} onToggleDay={handleToggleDay} />
                
                {/* Info box */}
                <div className="mt-4 p-3 rounded-lg bg-primary/10 flex gap-2">
                  <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-foreground/80">
                    Med detta läge laddar bilen hela natten på valda dagar. Perfekt om du har fast elpris.
                  </p>
                </div>
              </GlassCard>
            </motion.div>
          )}

          {mode === "days-with-time" && (
            <motion.div
              key="days-with-time"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              {/* Step 1: Days */}
              <GlassCard variant="subtle" className="p-4">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                    1
                  </div>
                  <h3 className="font-semibold">Välj ladddagar</h3>
                </div>
                <DaySelector selectedDays={selectedDays} onToggleDay={handleToggleDay} />
              </GlassCard>

              {/* Step 2: Time (only show if days selected) */}
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ 
                  opacity: selectedDays.length > 0 ? 1 : 0.5,
                  height: "auto"
                }}
              >
                <GlassCard variant="subtle" className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      selectedDays.length > 0 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-muted text-muted-foreground"
                    }`}>
                      2
                    </div>
                    <h3 className={`font-semibold ${selectedDays.length === 0 && "text-muted-foreground"}`}>
                      Välj laddtid
                    </h3>
                  </div>
                  
                  <div className="space-y-3">
                    <p className="text-xs text-muted-foreground">
                      Bilen laddas mellan dessa tider på alla valda dagar
                    </p>
                    <TimeRangePicker
                      startTime={globalTimeRange.start}
                      endTime={globalTimeRange.end}
                      onStartTimeChange={(time) =>
                        setGlobalTimeRange((prev) => ({ ...prev, start: time }))
                      }
                      onEndTimeChange={(time) =>
                        setGlobalTimeRange((prev) => ({ ...prev, end: time }))
                      }
                    />
                  </div>
                </GlassCard>
              </motion.div>
            </motion.div>
          )}

          {mode === "individual-times" && (
            <motion.div
              key="individual-times"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <GlassCard variant="subtle" className="p-4">
                <div className="flex items-center gap-2 mb-3">
                  <Settings2Icon className="w-5 h-5 text-primary" />
                  <h3 className="font-semibold">Skapa ditt schema</h3>
                </div>
                
                <p className="text-xs text-muted-foreground mb-4">
                  Lägg till dagar och ställ in unik laddtid för varje dag. 
                  Perfekt om du har olika rutiner på vardagar och helger.
                </p>
                
                <IndividualDaySchedule
                  schedules={individualSchedules}
                  onAddSchedule={handleAddSchedule}
                  onUpdateSchedule={handleUpdateSchedule}
                  onRemoveSchedule={handleRemoveSchedule}
                />
              </GlassCard>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Summary - only show when there's something to summarize */}
        {canSave && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <ScheduleSummary
              mode={mode}
              selectedDays={selectedDays}
              globalTimeRange={globalTimeRange}
              individualSchedules={individualSchedules}
            />
          </motion.div>
        )}
      </div>

      {/* Save Button */}
      <div className="p-4 pt-2">
        <Button
          onClick={handleSave}
          disabled={!canSave}
          className="w-full gap-2 h-12 text-base rounded-xl"
          size="lg"
        >
          <Save className="w-5 h-5" />
          {canSave ? "Spara schema" : "Välj minst en dag"}
        </Button>
      </div>
    </div>
  );
}

// Simple Settings2 icon component to avoid import issues
function Settings2Icon({ className }: { className?: string }) {
  return (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M20 7h-9" />
      <path d="M14 17H5" />
      <circle cx="17" cy="17" r="3" />
      <circle cx="7" cy="7" r="3" />
    </svg>
  );
}
