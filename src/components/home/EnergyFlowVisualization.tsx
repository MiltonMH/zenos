import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import chargerBoxImage from "@/assets/Sidan1Cropped.png";
import chargingCarImage from "@/assets/EX30-cutout.png";
import electricTowerImage from "@/assets/electric-tower.png";
import houseImage from "@/assets/houseZenOS2.png";
import ElectricCable from "@/components/charger/ElectricCable";

type ActiveMode = "charging" | "v2h" | "v2g";

interface EnergyFlowVisualizationProps {
  mode: ActiveMode;
  batteryLevel?: number;
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

export function EnergyFlowVisualization({ mode, batteryLevel }: EnergyFlowVisualizationProps) {
  const config = modeConfig[mode];
  const power = useDynamicPower(config.minPower, config.maxPower);
  const hidePowerIndicator = mode === "charging" && (batteryLevel ?? 0) >= 100;
  const usesSharedCable = mode === "charging" || mode === "v2h" || mode === "v2g";

  return (
    <div className="relative flex flex-col items-center h-full pb-2 overflow-hidden">
      {/* Shared cable background for active energy transfer modes */}
      {usesSharedCable && (
        <div
          className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[100px] flex items-center justify-center pointer-events-none overflow-hidden"
          style={mode === "v2h"
            ? { WebkitMaskImage: "linear-gradient(to right, black 65%, transparent 95%)", maskImage: "linear-gradient(to right, black 65%, transparent 95%)" }
            : mode === "v2g"
            ? { WebkitMaskImage: "linear-gradient(to right, black 85%, transparent 100%)", maskImage: "linear-gradient(to right, black 70%, transparent 100%)" }
            : undefined}
        >
          <ElectricCable mode={mode} fullWidth={mode === "v2h" || mode === "v2g"} />
        </div>
      )}

      {/* Energy flow visualization */}
      <div className={`flex-1 min-h-0 flex items-center gap-4 w-full relative z-10 ${usesSharedCable ? "max-w-none justify-between -mr-6 pr-0" : "max-w-xs justify-center"}`}>
        {/* Source */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col gap-2 relative z-10 items-center"
        >
          {mode === "charging" ? (
            <div className="relative">
              <img
                src={chargerBoxImage}
                alt="ZenBox Charger"
                draggable={false}
                className="w-24 max-h-sm:w-20 max-[375px]:w-18 max-[343px]:w-16 max-[320px]:w-14 h-auto opacity-100"
              />
            </div>
          ) : (mode === "v2h" || mode === "v2g") ? (
            <div className="relative w-48 max-h-sm:w-36 max-[375px]:w-30 max-[343px]:w-28 max-[320px]:w-24 overflow-hidden shrink-0">
              <img
                src={chargingCarImage}
                alt="Volvo EX30"
                draggable={false}
                className="w-80 max-h-sm:w-56 max-[375px]:w-48 max-[343px]:w-40 max-[320px]:w-32 h-auto max-w-none opacity-100 -scale-x-100 -ml-24 max-h-sm:-ml-10 max-[375px]:-ml-12 max-[343px]:-ml-10 max-[320px]:-ml-4"
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
        </motion.div>

        {/* Spacer between source and destination */}
        <div className="flex-1 flex items-center justify-center relative h-8 mx-2" style={{ overflow: 'visible' }} />

        {/* Destination */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex flex-col gap-2 relative z-10 ${usesSharedCable ? "items-end ml-auto" : "items-center"}`}
        >
          <motion.div
            animate={mode === "charging" ? undefined : {
              boxShadow: [
                `0 0 0 0 ${config.color}00`,
                `0 0 20px 5px ${config.color}30`,
                `0 0 0 0 ${config.color}00`,
              ],
            }}
            transition={mode === "charging" ? undefined : {
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className={mode === "charging" ? "relative w-48 max-h-sm:w-36 max-[375px]:w-32 max-[343px]:w-28 max-[320px]:w-24 overflow-hidden" : "relative w-48 h-48 max-h-sm:w-34 max-h-sm:h-34 max-[375px]:w-28 max-[375px]:h-28 max-[343px]:w-24 max-[343px]:h-24 max-[320px]:w-20 max-[320px]:h-20 overflow-visible"}
            style={mode === "v2h" ? { backgroundColor: `${config.color}15` } : undefined}
          >
            {mode === "charging" && (
              <img
                src={chargingCarImage}
                alt="Volvo EX30"
                draggable={false}
                className="w-80 max-h-sm:w-56 max-[375px]:w-48 max-[343px]:w-40 max-[320px]:w-32 h-auto pr-0 max-w-none opacity-100 -ml-4 max-h-sm:-ml-2 max-[375px]:-ml-2 max-[343px]:-ml-1 max-[320px]:-ml-0.5"
              />
            )}
            {mode === "v2h" && (
              <img
                src={houseImage}
                alt="Hus"
                draggable={false}
                className="w-full h-full object-contain"
              />
            )}
            {mode === "v2g" && (
              <img
                src={electricTowerImage}
                alt="Elnät"
                draggable={false}
                className="w-full h-full object-contain scale-100 origin-center"
              />
            )}
          </motion.div>
        </motion.div>
      </div>

      {!hidePowerIndicator && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative z-20 text-center shrink-0 pb-1"
        >
          <motion.span
            key={power}
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-3xl max-h-sm:text-[1.75rem] font-semibold text-foreground"
          >
            {power.toFixed(1)}
          </motion.span>
          <span className="text-lg max-h-sm:text-base text-[#404040] ml-1">kW</span>
        </motion.div>
      )}
    </div>
  );
}
