import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Loader2 } from "lucide-react";
import lightningIcon from "@/assets/Lightning_Vector1.svg";
import { Button } from "@/components/ui/button";
import { DataSourceField } from "@/components/ui/data-source-field";
import { DaySelector, type DayKey } from "@/components/schedule/DaySelector";
import { TimeRangePicker } from "@/components/schedule/TimeRangePicker";
import { useChargingSchedule } from "@/hooks/useChargingSchedule";
import { toast } from "sonner";
import { formatMessage, useLanguage } from "@/lib/i18n";
import { getScheduleTexts } from "@/lib/schedule-i18n";
import { getCommonTexts } from "@/lib/common-i18n";

interface ChargingScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChargingScheduleModal({ isOpen, onClose }: ChargingScheduleModalProps) {
  const { language } = useLanguage();
  const schedule = getScheduleTexts(language);
  const common = getCommonTexts(language);
  const {
    selectedDays,
    timeRange,
    setTimeRange,
    loading,
    saving,
    fromApi,
    canSave,
    toggleDay,
    save,
  } = useChargingSchedule(isOpen);

  const handleSave = async () => {
    if (!canSave) {
      toast.error(schedule.toastNoVehicle);
      return;
    }

    const ok = await save();
    if (ok) {
      toast.success(schedule.toastSaved);
      onClose();
      return;
    }

    toast.error(schedule.toastFailed);
  };

  const getShortLabel = (key: DayKey) => schedule.days[key].short;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
          />

          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-md"
            >
              <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
                <div className="flex items-center justify-between p-4 pb-2">
                  <div className="flex items-center gap-2">
                    <img src={lightningIcon} alt="" className="w-5 h-5" />
                    <h2 className="font-semibold text-lg">{schedule.modalTitle}</h2>
                  </div>
                  <button
                    type="button"
                    onClick={onClose}
                    className="p-2 -mr-2 rounded-full hover:bg-black/5 transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>

                <div className="px-4 pb-4">
                  <DataSourceField fromApi={fromApi} className="rounded-2xl p-3 space-y-5">
                    {loading ? (
                      <div className="flex items-center justify-center gap-2 py-10 text-sm text-muted-foreground">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        {schedule.loading}
                      </div>
                    ) : (
                      <>
                        <div>
                          <p className="text-sm text-muted-foreground mb-3">{schedule.selectDays}</p>
                          <DaySelector
                            selectedDays={selectedDays}
                            onToggleDay={toggleDay}
                            showLabels={false}
                          />
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-3">{schedule.chargeTime}</p>
                          <TimeRangePicker
                            startTime={timeRange.start}
                            endTime={timeRange.end}
                            onStartTimeChange={(time) =>
                              setTimeRange((prev) => ({ ...prev, start: time }))
                            }
                            onEndTimeChange={(time) =>
                              setTimeRange((prev) => ({ ...prev, end: time }))
                            }
                          />
                        </div>

                        {selectedDays.length > 0 && (
                          <p className="text-xs text-center text-muted-foreground">
                            {formatMessage(schedule.summary, {
                              days: selectedDays.map(getShortLabel).join(", "),
                              start: timeRange.start,
                              end: timeRange.end,
                            })}
                          </p>
                        )}

                        <Button
                          onClick={() => void handleSave()}
                          disabled={!canSave}
                          className="w-full h-11 rounded-xl gap-2"
                        >
                          {saving ? (
                            <Loader2 className="w-4 h-4 animate-spin" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                          {common.save}
                        </Button>
                      </>
                    )}
                  </DataSourceField>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
