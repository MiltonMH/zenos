import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Car } from "lucide-react";
import chargerBoxImage from "@/assets/Sidan1Cropped.png";
import chargingCarImage from "@/assets/EX30-cutout.png";
import electricTowerImage from "@/assets/electric-tower.png";
import houseImage from "@/assets/houseZenOS2.png";

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

  return (
    <div className="relative flex flex-col items-center h-full pb-9">
      {/* Energy flow visualization */}
      <div className={`flex-1 min-h-0 flex items-center gap-4 w-full ${(mode === "charging" || mode === "v2h" || mode === "v2g") ? (mode === "charging" ? "max-w-none justify-between -mr-6 pr-0" : "max-w-none justify-between pr-2") : "max-w-xs justify-center"}`}>
        {/* Source */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex flex-col gap-2 ${(mode === "v2h" || mode === "v2g") ? "items-start" : "items-center"}`}
        >
          {mode === "charging" ? (
            <div className="relative">
              <img
                src={chargerBoxImage}
                alt="ZenBox Charger"
                className="w-24 max-h-sm:w-23 h-auto opacity-100"
              />
            </div>
          ) : (mode === "v2h" || mode === "v2g") ? (
            <div className="relative w-48 max-h-sm:w-34 shrink-0">
              <img
                src={chargingCarImage}
                alt="Volvo EX30"
                className="w-72 max-h-sm:w-48 h-auto max-w-none opacity-100 -scale-x-100 max-h-sm:-ml-14 -ml-28"
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
        <div className="flex-1 flex items-center justify-center relative h-8 mx-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-4 h-4 rounded-full brightness-[1.2] saturate-110"
              style={{ backgroundColor: config.color }}
              initial={{ x: "-100%", opacity: 0.5, scale: 0.9 }}
              animate={{
                x: ["-100%", "200%"],
                opacity: [0.5, 1, 1, 0.5],
                scale: [0.9, 1.08, 1.08, 0.9],
                boxShadow: [
                  `0 0 4px 1px ${config.color}33, 0 0 6px 1px rgba(255,255,255,0.28)`,
                  `0 0 16px 3px ${config.color}66, 0 0 10px 2px rgba(255,255,255,0.46)`,
                  `0 0 16px 3px ${config.color}66, 0 0 10px 2px rgba(255,255,255,0.46)`,
                  `0 0 4px 1px ${config.color}33, 0 0 6px 1px rgba(255,255,255,0.28)`,
                ],
              }}
              transition={{
                duration: 1.25,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "linear",
                times: [0, 0.12, 0.82, 1],
              }}
            />
          ))}
          {/* Track line */}
          <div
            className="absolute inset-x-0 h-0.5 rounded-full opacity-20"
            style={{ backgroundColor: config.color }}
          />
        </div>

        {/* Destination */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className={`flex flex-col gap-2 ${mode === "charging" ? "items-end ml-auto" : "items-center"}`}
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
            className={mode === "charging" ? "relative w-48 max-h-sm:w-36 overflow-hidden" : mode === "v2g" ? "relative w-48 h-48 max-h-sm:w-34 max-h-sm:h-34 overflow-visible" : "p-3 rounded-2xl"}
            style={mode === "charging" || mode === "v2g" ? undefined : { backgroundColor: `${config.color}15` }}
          >
            {mode === "charging" && (
              <img
                src={chargingCarImage}
                alt="Volvo EX30"
                className="w-80 max-h-sm:w-60 h-auto pr-0 max-w-none opacity-100 -ml-4 max-h-sm:-ml-2"
              />
            )}
            {mode === "v2h" && (
              <img
                src={houseImage}
                  alt="Hus"
                  className="w-[16rem] max-h-[24vh] max-h-sm:w-[12rem] max-h-sm:max-h-[18vh] max-w-none object-contain -ml-2"
              />
            )}
            {mode === "v2g" && (
              <img
                src={electricTowerImage}
                alt="Elnät"
                className="w-full h-full object-contain scale-100 origin-center"
              />
            )}
          </motion.div>
        </motion.div>
      </div>

      {!hidePowerIndicator && (
        <>
          {/* Power indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="absolute bottom-12 max-h-sm:bottom-10 left-0 right-0 text-center"
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
        </>
      )}
    </div>
  );
}
