import { motion, AnimatePresence } from "framer-motion";
import { Zap, Trash2, Plus } from "lucide-react";
import { TimeRangePicker } from "./TimeRangePicker";
import { days, type DayKey } from "./DaySelector";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface IndividualSchedule {
  day: DayKey;
  start: string;
  end: string;
}

interface IndividualDayScheduleProps {
  schedules: IndividualSchedule[];
  onAddSchedule: (schedule: IndividualSchedule) => void;
  onUpdateSchedule: (index: number, schedule: IndividualSchedule) => void;
  onRemoveSchedule: (index: number) => void;
}

export function IndividualDaySchedule({
  schedules,
  onAddSchedule,
  onUpdateSchedule,
  onRemoveSchedule,
}: IndividualDayScheduleProps) {
  const getDayLabel = (key: DayKey) => days.find((d) => d.key === key)?.label || key;
  
  const usedDays = schedules.map((s) => s.day);
  const availableDays = days.filter((d) => !usedDays.includes(d.key));

  const handleAddDay = (dayKey: string) => {
    onAddSchedule({
      day: dayKey as DayKey,
      start: "21:00",
      end: "06:00",
    });
  };

  return (
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {schedules.map((schedule, index) => (
          <motion.div
            key={schedule.day}
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: "auto" }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            transition={{ duration: 0.2 }}
            className="glass-subtle rounded-xl p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 text-primary" />
                </div>
                <span className="font-medium">{getDayLabel(schedule.day)}</span>
              </div>
              <button
                onClick={() => onRemoveSchedule(index)}
                className="p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1.5 block">Start</label>
                <Select
                  value={schedule.start}
                  onValueChange={(value) =>
                    onUpdateSchedule(index, { ...schedule, start: value })
                  }
                >
                  <SelectTrigger className="glass border-white/30 bg-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-white/50">
                    {Array.from({ length: 24 }, (_, i) => {
                      const time = `${i.toString().padStart(2, "0")}:00`;
                      return (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="text-muted-foreground mt-5">—</div>
              
              <div className="flex-1">
                <label className="text-xs text-muted-foreground mb-1.5 block">Slut</label>
                <Select
                  value={schedule.end}
                  onValueChange={(value) =>
                    onUpdateSchedule(index, { ...schedule, end: value })
                  }
                >
                  <SelectTrigger className="glass border-white/30 bg-white/50">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-white/95 backdrop-blur-xl border-white/50">
                    {Array.from({ length: 24 }, (_, i) => {
                      const time = `${i.toString().padStart(2, "0")}:00`;
                      return (
                        <SelectItem key={time} value={time}>
                          {time}
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Add day button */}
      {availableDays.length > 0 && (
        <div className="glass-subtle rounded-xl p-3">
          <Select onValueChange={handleAddDay}>
            <SelectTrigger className="w-full bg-transparent border-none hover:bg-white/30 transition-colors">
              <div className="flex items-center gap-2 text-muted-foreground">
                <Plus className="w-4 h-4" />
                <span>Lägg till dag</span>
              </div>
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/50">
              {availableDays.map((day) => (
                <SelectItem key={day.key} value={day.key}>
                  {day.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
    </div>
  );
}
