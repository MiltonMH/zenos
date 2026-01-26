import { motion } from "framer-motion";
import { Battery, Zap, Car, Home, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

type ChargingMode = "idle" | "charging" | "v2h" | "v2g";

interface ChargerStatusProps {
  mode: ChargingMode;
  power: number;
  batteryLevel: number;
  isConnected: boolean;
}

const modeConfig = {
  idle: {
    label: "Redo",
    color: "text-muted-foreground",
    bgColor: "bg-muted/50",
    icon: Car,
  },
  charging: {
    label: "Laddar",
    color: "text-energy-charging",
    bgColor: "bg-energy-charging/20",
    icon: Zap,
  },
  v2h: {
    label: "V2H Aktiv",
    color: "text-energy-v2h",
    bgColor: "bg-energy-v2h/20",
    icon: Home,
  },
  v2g: {
    label: "Säljer El",
    color: "text-energy-v2g",
    bgColor: "bg-energy-v2g/20",
    icon: TrendingUp,
  },
};

export function ChargerStatus({ mode, power, batteryLevel, isConnected }: ChargerStatusProps) {
  const config = modeConfig[mode];
  const Icon = config.icon;

  return (
    <div className="relative">
      {/* Central charging visualization */}
      <div className="flex flex-col items-center">
        {/* Animated ring */}
        <div className="relative w-48 h-48 mb-6">
          {/* Background ring */}
          <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--glass-border))"
              strokeWidth="6"
            />
            {/* Progress ring */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={mode === "charging" ? "hsl(var(--energy-charging))" : 
                     mode === "v2h" ? "hsl(var(--energy-v2h))" :
                     mode === "v2g" ? "hsl(var(--energy-v2g))" :
                     "hsl(var(--muted))"}
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={`${batteryLevel * 2.83} 283`}
              initial={{ strokeDasharray: "0 283" }}
              animate={{ strokeDasharray: `${batteryLevel * 2.83} 283` }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />
          </svg>

          {/* Center content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <motion.div
              className={cn("p-4 rounded-full mb-2", config.bgColor)}
              animate={mode !== "idle" ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Icon className={cn("w-8 h-8", config.color)} />
            </motion.div>
            <span className="text-3xl font-semibold">{batteryLevel}%</span>
            <span className={cn("text-sm font-medium", config.color)}>
              {config.label}
            </span>
          </div>

          {/* Animated glow effect for active states */}
          {mode !== "idle" && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: mode === "charging" 
                  ? "radial-gradient(circle, hsl(var(--energy-charging) / 0.2) 0%, transparent 70%)"
                  : mode === "v2h"
                  ? "radial-gradient(circle, hsl(var(--energy-v2h) / 0.2) 0%, transparent 70%)"
                  : "radial-gradient(circle, hsl(var(--energy-v2g) / 0.2) 0%, transparent 70%)",
              }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>

        {/* Power display */}
        {mode !== "idle" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 px-4 py-2 rounded-full glass"
          >
            <Battery className="w-5 h-5 text-primary" />
            <span className="text-2xl font-semibold">{power.toFixed(1)}</span>
            <span className="text-muted-foreground">kW</span>
          </motion.div>
        )}

        {/* Connection status */}
        <div className="flex items-center gap-2 mt-4">
          <div
            className={cn(
              "w-2 h-2 rounded-full",
              isConnected ? "bg-success status-pulse" : "bg-destructive"
            )}
          />
          <span className="text-sm text-muted-foreground">
            {isConnected ? "Bil ansluten" : "Ingen bil ansluten"}
          </span>
        </div>
      </div>
    </div>
  );
}
