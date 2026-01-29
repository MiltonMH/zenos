import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sunrise, Sunset } from "lucide-react";

interface TimeRangePickerProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
  label?: string;
}

// Generate time options from 00:00 to 23:00
const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

// Get time period label
const getTimePeriod = (hour: number) => {
  if (hour >= 6 && hour < 12) return "morgon";
  if (hour >= 12 && hour < 18) return "eftermiddag";
  if (hour >= 18 && hour < 22) return "kväll";
  return "natt";
};

export function TimeRangePicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  label,
}: TimeRangePickerProps) {
  const startHour = parseInt(startTime.split(":")[0]);
  const endHour = parseInt(endTime.split(":")[0]);

  return (
    <div className="space-y-3">
      {label && (
        <p className="text-sm font-medium text-foreground">{label}</p>
      )}
      
      <div className="flex items-stretch gap-3">
        {/* Start time */}
        <div className="flex-1 glass-subtle rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sunset className="w-4 h-4 text-warning" />
            <label className="text-xs font-medium text-foreground">Börja ladda</label>
          </div>
          <Select value={startTime} onValueChange={onStartTimeChange}>
            <SelectTrigger className="bg-white/60 border-white/40 h-12 text-lg font-semibold">
              <SelectValue placeholder="Start" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/50">
              {timeOptions.map((time) => (
                <SelectItem key={`start-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            {getTimePeriod(startHour)}
          </p>
        </div>
        
        {/* Separator */}
        <div className="flex items-center text-muted-foreground text-xl font-light">
          →
        </div>
        
        {/* End time */}
        <div className="flex-1 glass-subtle rounded-xl p-3">
          <div className="flex items-center gap-2 mb-2">
            <Sunrise className="w-4 h-4 text-primary" />
            <label className="text-xs font-medium text-foreground">Sluta ladda</label>
          </div>
          <Select value={endTime} onValueChange={onEndTimeChange}>
            <SelectTrigger className="bg-white/60 border-white/40 h-12 text-lg font-semibold">
              <SelectValue placeholder="Slut" />
            </SelectTrigger>
            <SelectContent className="bg-white/95 backdrop-blur-xl border-white/50">
              {timeOptions.map((time) => (
                <SelectItem key={`end-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
            {getTimePeriod(endHour)}
          </p>
        </div>
      </div>
    </div>
  );
}
