import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface TimeRangePickerProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (time: string) => void;
  onEndTimeChange: (time: string) => void;
}

const timeOptions = Array.from({ length: 24 }, (_, i) => {
  const hour = i.toString().padStart(2, "0");
  return `${hour}:00`;
});

export function TimeRangePicker({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: TimeRangePickerProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1">
        <Select value={startTime} onValueChange={onStartTimeChange}>
          <SelectTrigger className="h-12 text-center text-lg font-medium bg-muted/50 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-border">
            {timeOptions.map((time) => (
              <SelectItem key={`start-${time}`} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <span className="text-muted-foreground">→</span>
      
      <div className="flex-1">
        <Select value={endTime} onValueChange={onEndTimeChange}>
          <SelectTrigger className="h-12 text-center text-lg font-medium bg-muted/50 border-0">
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-white border-border">
            {timeOptions.map((time) => (
              <SelectItem key={`end-${time}`} value={time}>
                {time}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
