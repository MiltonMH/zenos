import { motion } from "framer-motion";
import { Clock, Sparkles, ChevronRight } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

interface ScheduleSlot {
  time: string;
  action: "charge" | "v2h" | "idle";
  price?: number;
}

interface ChargingScheduleCardProps {
  isSmartScheduleActive: boolean;
  nextAction: string;
  nextActionTime: string;
  schedule: ScheduleSlot[];
  onToggleSmart: () => void;
}

export function ChargingScheduleCard({
  isSmartScheduleActive,
  nextAction,
  nextActionTime,
  schedule,
}: ChargingScheduleCardProps) {
  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-primary" />
          <h3 className="font-medium">Smart Schema</h3>
        </div>
        {isSmartScheduleActive && (
          <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary/20 text-primary rounded-full">
            <Sparkles className="w-3 h-3" />
            AI Optimerat
          </span>
        )}
      </div>

      {/* Next action preview */}
      <div className="p-3 rounded-xl bg-muted/50 mb-4">
        <p className="text-sm text-muted-foreground">Nästa åtgärd</p>
        <div className="flex items-center justify-between mt-1">
          <span className="font-medium">{nextAction}</span>
          <span className="text-primary font-semibold">{nextActionTime}</span>
        </div>
      </div>

      {/* Schedule timeline */}
      <div className="space-y-2">
        {schedule.slice(0, 4).map((slot, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center justify-between py-2 border-b border-glass-border/50 last:border-0"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground w-12">{slot.time}</span>
              <div className={cn(
                "w-2 h-2 rounded-full",
                slot.action === "charge" && "bg-energy-charging",
                slot.action === "v2h" && "bg-energy-v2h",
                slot.action === "idle" && "bg-muted-foreground"
              )} />
              <span className="text-sm capitalize">
                {slot.action === "charge" ? "Ladda" : slot.action === "v2h" ? "V2H" : "Vänta"}
              </span>
            </div>
            {slot.price !== undefined && (
              <span className={cn(
                "text-xs",
                slot.price < 0.5 ? "text-success" : slot.price < 1.5 ? "text-warning" : "text-destructive"
              )}>
                {slot.price.toFixed(2)} SEK
              </span>
            )}
          </motion.div>
        ))}
      </div>

      {/* View full schedule */}
      <button className="flex items-center justify-center gap-1 w-full mt-4 py-2 text-sm text-primary hover:text-primary/80 transition-colors">
        Se hela schemat
        <ChevronRight className="w-4 h-4" />
      </button>
    </GlassCard>
  );
}
