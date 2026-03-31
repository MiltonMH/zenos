import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check } from "lucide-react";
import lightningIcon from "@/assets/Lightning_Vector1.svg";
import { Button } from "@/components/ui/button";
import { DaySelector, type DayKey, days } from "@/components/schedule/DaySelector";
import { TimeRangePicker } from "@/components/schedule/TimeRangePicker";
import { toast } from "sonner";

interface ChargingScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChargingScheduleModal({ isOpen, onClose }: ChargingScheduleModalProps) {
  const [selectedDays, setSelectedDays] = useState<DayKey[]>(["mon", "wed", "fri"]);
  const [timeRange, setTimeRange] = useState({ start: "21:00", end: "06:00" });

  const handleToggleDay = (day: DayKey) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const handleSave = () => {
    toast.success("Schema sparat!");
    onClose();
  };

  const getShortLabel = (key: DayKey) => days.find((d) => d.key === key)?.short || key;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
            >
            <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-4 pb-2">
                <div className="flex items-center gap-2">
                  <img src={lightningIcon} alt="" className="w-5 h-5" />
                  <h2 className="font-semibold text-lg">Laddschema</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Content */}
              <div className="px-4 pb-4 space-y-5">
                {/* Days */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Välj dagar</p>
                  <DaySelector
                    selectedDays={selectedDays}
                    onToggleDay={handleToggleDay}
                    showLabels={false}
                  />
                </div>

                {/* Time */}
                <div>
                  <p className="text-sm text-muted-foreground mb-3">Laddtid</p>
                  <TimeRangePicker
                    startTime={timeRange.start}
                    endTime={timeRange.end}
                    onStartTimeChange={(time) => setTimeRange((prev) => ({ ...prev, start: time }))}
                    onEndTimeChange={(time) => setTimeRange((prev) => ({ ...prev, end: time }))}
                  />
                </div>

                {/* Summary */}
                {selectedDays.length > 0 && (
                  <p className="text-xs text-center text-muted-foreground">
                    Laddar {selectedDays.map(getShortLabel).join(", ")} kl {timeRange.start}–{timeRange.end}
                  </p>
                )}

                {/* Save Button */}
                <Button
                  onClick={handleSave}
                  disabled={selectedDays.length === 0}
                  className="w-full h-11 rounded-xl gap-2"
                >
                  <Check className="w-4 h-4" />
                  Spara
                </Button>
              </div>
            </div>
          </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
