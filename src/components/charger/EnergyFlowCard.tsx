import { motion } from "framer-motion";
import { ArrowRight, Home, Car, Zap, Building2 } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";

type FlowDirection = "grid-to-car" | "car-to-home" | "car-to-grid" | "idle";

interface EnergyFlowCardProps {
  direction: FlowDirection;
  power: number;
}

const flowConfig = {
  "grid-to-car": {
    from: { icon: Zap, label: "Elnät" },
    to: { icon: Car, label: "Bil" },
    color: "energy-charging",
  },
  "car-to-home": {
    from: { icon: Car, label: "Bil" },
    to: { icon: Home, label: "Hem" },
    color: "energy-v2h",
  },
  "car-to-grid": {
    from: { icon: Car, label: "Bil" },
    to: { icon: Building2, label: "Elnät" },
    color: "energy-v2g",
  },
  idle: {
    from: { icon: Car, label: "Bil" },
    to: { icon: Home, label: "Hem" },
    color: "muted",
  },
};

export function EnergyFlowCard({ direction, power }: EnergyFlowCardProps) {
  const config = flowConfig[direction];
  const FromIcon = config.from.icon;
  const ToIcon = config.to.icon;
  const isActive = direction !== "idle";

  return (
    <GlassCard className="relative overflow-hidden">
      <h3 className="text-sm font-medium text-muted-foreground mb-4">Energiflöde</h3>
      
      <div className="flex items-center justify-between">
        {/* From */}
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "p-3 rounded-xl",
            isActive ? `bg-${config.color}/20` : "bg-muted/50"
          )}>
            <FromIcon className={cn(
              "w-6 h-6",
              isActive ? `text-${config.color}` : "text-muted-foreground"
            )} />
          </div>
          <span className="text-xs text-muted-foreground">{config.from.label}</span>
        </div>

        {/* Flow animation */}
        <div className="flex-1 mx-4 relative h-8 flex items-center">
          <div className="absolute inset-x-0 h-0.5 bg-glass-border rounded-full" />
          
          {isActive && (
            <>
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className={cn(
                    "absolute w-3 h-3 rounded-full",
                    direction === "grid-to-car" && "bg-energy-charging",
                    direction === "car-to-home" && "bg-energy-v2h",
                    direction === "car-to-grid" && "bg-energy-v2g"
                  )}
                  initial={{ left: "0%", opacity: 0 }}
                  animate={{ 
                    left: ["0%", "100%"],
                    opacity: [0, 1, 1, 0]
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    delay: i * 0.5,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </>
          )}
        </div>

        {/* To */}
        <div className="flex flex-col items-center gap-2">
          <div className={cn(
            "p-3 rounded-xl",
            isActive ? `bg-${config.color}/20` : "bg-muted/50"
          )}>
            <ToIcon className={cn(
              "w-6 h-6",
              isActive ? `text-${config.color}` : "text-muted-foreground"
            )} />
          </div>
          <span className="text-xs text-muted-foreground">{config.to.label}</span>
        </div>
      </div>

      {/* Power display */}
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center mt-4"
        >
          <span className="text-2xl font-semibold">{power.toFixed(1)}</span>
          <span className="text-muted-foreground ml-1">kW</span>
        </motion.div>
      )}
    </GlassCard>
  );
}
