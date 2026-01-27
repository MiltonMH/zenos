import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Building2, Car } from "lucide-react";
import chargerBoxImage from "@/assets/charger-box.png";

type ActiveMode = "charging" | "v2h" | "v2g";

interface EnergyFlowVisualizationProps {
  mode: ActiveMode;
}

const modeConfig = {
  charging: {
    color: "hsl(var(--energy-charging))",
    label: "Laddar",
    minPower: 4,
    maxPower: 8,
  },
  v2h: {
    color: "hsl(var(--energy-v2h))",
    label: "Vehicle-to-Home",
    minPower: 2,
    maxPower: 4,
  },
  v2g: {
    color: "hsl(var(--energy-v2g))",
    label: "Vehicle-to-Grid",
    minPower: 2,
    maxPower: 6,
  },
};

// Hook for simulating realistic power fluctuation
function useDynamicPower(minPower: number, maxPower: number) {
  const midPoint = (minPower + maxPower) / 2;
  const [power, setPower] = useState(midPoint);

  useEffect(() => {
    const interval = setInterval(() => {
      // Small random fluctuation around current value for realism
      setPower((prev) => {
        const fluctuation = (Math.random() - 0.5) * 0.6; // ±0.3 kW change
        const newPower = prev + fluctuation;
        // Keep within bounds with slight bias toward middle
        const bounded = Math.max(minPower, Math.min(maxPower, newPower));
        return Math.round(bounded * 10) / 10; // Round to 1 decimal
      });
    }, 1500); // Update every 1.5 seconds

    return () => clearInterval(interval);
  }, [minPower, maxPower]);

  return power;
}

export function EnergyFlowVisualization({ mode }: EnergyFlowVisualizationProps) {
  const config = modeConfig[mode];
  const power = useDynamicPower(config.minPower, config.maxPower);

  return (
    <div className="flex flex-col items-center justify-center h-full px-6">
      {/* Mode label */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6"
      >
        <span 
          className="text-sm font-medium px-3 py-1 rounded-full"
          style={{ 
            backgroundColor: `${config.color}20`,
            color: config.color 
          }}
        >
          {config.label}
        </span>
      </motion.div>

      {/* Energy flow visualization */}
      <motion.div
        animate={{
          opacity: [0.5, 0.75, 0.5],
          scale: [1, 1.01, 1],
        }}
        transition={{
          duration: 2.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="rounded-2xl px-6 py-4"
        style={{ backgroundColor: `${config.color}20` }}
      >
        <div className="flex items-center justify-center gap-4 w-full max-w-xs">
          {/* Source */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center gap-2"
          >
            {mode === "charging" ? (
              <div className="relative">
                <img 
                  src={chargerBoxImage} 
                  alt="ZenBox Charger" 
                  className="w-16 h-auto opacity-80"
                />
              </div>
            ) : (
              <div 
                className="p-3 rounded-2xl"
                style={{ backgroundColor: `${config.color}15` }}
              >
                <Car className="w-8 h-8" style={{ color: config.color }} />
              </div>
            )}
            <span className="text-xs text-muted-foreground">
              {mode === "charging" ? "Laddbox" : "Bil"}
            </span>
          </motion.div>

          {/* Simple arrow/flow indicator */}
          <div className="flex-1 flex items-center justify-center relative h-8 mx-2">
            <div 
              className="w-full h-0.5 rounded-full"
              style={{ backgroundColor: config.color }}
            />
          </div>

          {/* Destination */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="p-3 rounded-2xl"
              style={{ backgroundColor: `${config.color}15` }}
            >
              {mode === "charging" && (
                <Car className="w-8 h-8" style={{ color: config.color }} />
              )}
              {mode === "v2h" && (
                <Home className="w-8 h-8" style={{ color: config.color }} />
              )}
              {mode === "v2g" && (
                <Building2 className="w-8 h-8" style={{ color: config.color }} />
              )}
            </div>
            <span className="text-xs text-muted-foreground">
              {mode === "charging" ? "Bil" : mode === "v2h" ? "Hem" : "Elnät"}
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Battery level indicator for charging mode */}
      {mode === "charging" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 w-full max-w-[200px]"
        >
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Batterinivå</span>
            <span className="text-primary">Laddar...</span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: config.color }}
              initial={{ width: "52%" }}
              animate={{ width: "54%" }}
              transition={{
                duration: 60,
                ease: "linear",
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted-foreground">52%</span>
            <span className="text-muted-foreground">~2h kvar</span>
          </div>
        </motion.div>
      )}

      {/* Power indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-4 text-center"
      >
        <motion.span 
          key={power}
          initial={{ opacity: 0.5, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-2xl font-semibold text-foreground"
        >
          {power.toFixed(1)}
        </motion.span>
        <span className="text-muted-foreground ml-1">kW</span>
      </motion.div>
    </div>
  );
}
