import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Clock } from "lucide-react";

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

export function TimeRangePicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
  label,
}: TimeRangePickerProps) {
  return (
    <div className="glass-subtle rounded-xl p-4">
      {label && (
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-primary" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      )}
      
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1.5 block">Start</label>
          <Select value={startTime} onValueChange={onStartTimeChange}>
            <SelectTrigger className="glass border-white/30 bg-white/50">
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
        </div>
        
        <div className="text-muted-foreground mt-5">—</div>
        
        <div className="flex-1">
          <label className="text-xs text-muted-foreground mb-1.5 block">Slut</label>
          <Select value={endTime} onValueChange={onEndTimeChange}>
            <SelectTrigger className="glass border-white/30 bg-white/50">
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
        </div>
      </div>
    </div>
  );
}
