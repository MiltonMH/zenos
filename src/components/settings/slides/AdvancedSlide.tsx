import { Settings as SettingsIcon } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdvancedSlideProps {
  minV2gBattery: string;
  conflictPriority: string;
  timeRestriction: string;
  onMinV2gBatteryChange: (value: string) => void;
  onConflictPriorityChange: (value: string) => void;
  onTimeRestrictionChange: (value: string) => void;
}

export function AdvancedSlide({
  minV2gBattery,
  conflictPriority,
  timeRestriction,
  onMinV2gBatteryChange,
  onConflictPriorityChange,
  onTimeRestrictionChange,
}: AdvancedSlideProps) {
  return (
    <div className="px-4 py-2 pb-8">
      <div className="flex items-center justify-center gap-2 mb-4">
        <SettingsIcon className="w-4 h-4 text-muted-foreground" />
        <h2 className="text-base font-semibold text-foreground">Avancerat</h2>
      </div>
      
      <div className="space-y-4">
        {/* Min V2G Battery */}
        <div className="glass-subtle rounded-2xl p-4 space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Minsta batteri för V2G
          </Label>
          <p className="text-xs text-muted-foreground">Starta inte V2G om batteri under:</p>
          <Select value={minV2gBattery} onValueChange={onMinV2gBatteryChange}>
            <SelectTrigger className="glass-subtle border-white/20 h-10">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="60">60%</SelectItem>
              <SelectItem value="70">70%</SelectItem>
              <SelectItem value="80">80%</SelectItem>
              <SelectItem value="90">90%</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Conflict Priority */}
        <div className="glass-subtle rounded-2xl p-4 space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Prioritet vid konflikt
          </Label>
          <p className="text-xs text-muted-foreground">Om både V2H och V2G är lönsamma:</p>
          <RadioGroup value={conflictPriority} onValueChange={onConflictPriorityChange} className="space-y-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="v2h" id="priority-v2h" />
              <Label htmlFor="priority-v2h" className="text-sm cursor-pointer text-foreground">Prioritera V2H</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="v2g" id="priority-v2g" />
              <Label htmlFor="priority-v2g" className="text-sm cursor-pointer text-foreground">Prioritera V2G</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="ai" id="priority-ai" />
              <Label htmlFor="priority-ai" className="text-sm cursor-pointer text-foreground">AI bestämmer</Label>
            </div>
          </RadioGroup>
        </div>

        {/* Time Restrictions */}
        <div className="glass-subtle rounded-2xl p-4 space-y-3">
          <Label className="text-sm font-medium text-foreground">
            Tidsbegränsning V2X
          </Label>
          <RadioGroup value={timeRestriction} onValueChange={onTimeRestrictionChange} className="space-y-2">
            <div className="flex items-center gap-2">
              <RadioGroupItem value="always" id="time-always" />
              <Label htmlFor="time-always" className="text-sm cursor-pointer text-foreground">Alltid (24/7)</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="night" id="time-night" />
              <Label htmlFor="time-night" className="text-sm cursor-pointer text-foreground">Endast natt (22-06)</Label>
            </div>
            <div className="flex items-center gap-2">
              <RadioGroupItem value="custom" id="time-custom" />
              <Label htmlFor="time-custom" className="text-sm cursor-pointer text-foreground">Anpassat schema</Label>
            </div>
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}
