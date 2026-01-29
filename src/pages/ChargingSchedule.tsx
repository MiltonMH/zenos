import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Save, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { DaySelector, type DayKey } from "@/components/schedule/DaySelector";
import { TimeRangePicker } from "@/components/schedule/TimeRangePicker";
import { toast } from "sonner";
import { days } from "@/components/schedule/DaySelector";

interface ChargingScheduleProps {
  onBack: () => void;
}

export default function ChargingSchedule({ onBack }: ChargingScheduleProps) {
  const [selectedDays, setSelectedDays] = useState<DayKey[]>([]);
  const [timeRange, setTimeRange] = useState({ start: "21:00", end: "06:00" });

  const handleToggleDay = (day: DayKey) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    toast.success("Laddschemat har sparats!", {
      description: "Dina inställningar är nu aktiva.",
    });
    onBack();
  };

  const canSave = selectedDays.length > 0;
  const getShortLabel = (key: DayKey) => days.find((d) => d.key === key)?.short || key;

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
        {/* Step 1: Select Days */}
        <GlassCard variant="subtle" className="p-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
              1
            </div>
            <h3 className="font-semibold">Välj ladddagar</h3>
          </div>
          <DaySelector selectedDays={selectedDays} onToggleDay={handleToggleDay} />
        </GlassCard>

        {/* Step 2: Select Time */}
        <motion.div
          initial={{ opacity: 0.5 }}
          animate={{ opacity: selectedDays.length > 0 ? 1 : 0.5 }}
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
            
            <TimeRangePicker
              startTime={timeRange.start}
              endTime={timeRange.end}
              onStartTimeChange={(time) => setTimeRange((prev) => ({ ...prev, start: time }))}
              onEndTimeChange={(time) => setTimeRange((prev) => ({ ...prev, end: time }))}
            />
          </GlassCard>
        </motion.div>

        {/* Summary */}
        {canSave && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-xl p-4 bg-success/10 border border-success/30"
          >
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-success/20 flex items-center justify-center flex-shrink-0">
                <Zap className="w-4 h-4 text-success" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-foreground mb-1">
                  Redo att spara
                </h4>
                <p className="text-sm text-muted-foreground">
                  Bilen laddas{" "}
                  <span className="font-semibold text-foreground">
                    {selectedDays.map(getShortLabel).join(", ")}
                  </span>{" "}
                  mellan{" "}
                  <span className="font-semibold text-primary">{timeRange.start}</span>
                  {" "}och{" "}
                  <span className="font-semibold text-primary">{timeRange.end}</span>
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Info */}
        {!canSave && (
          <div className="p-3 rounded-lg bg-primary/10 flex gap-2">
            <Info className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
            <p className="text-xs text-foreground/80">
              Välj minst en dag för att schemalägga laddning. Bilen laddar automatiskt mellan de tider du väljer.
            </p>
          </div>
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
