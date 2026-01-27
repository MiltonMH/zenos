import { motion } from "framer-motion";
import { Home, Building2, BatteryCharging } from "lucide-react";
import chargerBoxImage from "@/assets/charger-box.png";

type ActiveMode = "charging" | "v2h" | "v2g";

interface EnergyFlowVisualizationProps {
  mode: ActiveMode;
}

const modeConfig = {
  charging: {
    color: "hsl(var(--energy-charging))",
    label: "Laddar",
  },
  v2h: {
    color: "hsl(var(--energy-v2h))",
    label: "Vehicle-to-Home",
  },
  v2g: {
    color: "hsl(var(--energy-v2g))",
    label: "Vehicle-to-Grid",
  },
};

// Animated car with battery indicator
function AnimatedCar({ color, isCharging }: { color: string; isCharging: boolean }) {
  return (
    <div className="relative">
      {/* Car SVG */}
      <svg 
        width="48" 
        height="48" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        {/* Car body */}
        <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9L18 10l-2-4H8L6 10l-2.5 1.1C2.7 11.3 2 12.1 2 13v3c0 .6.4 1 1 1h2" />
        <circle cx="7" cy="17" r="2" />
        <circle cx="17" cy="17" r="2" />
        
        {/* Battery inside car */}
        <rect x="9" y="8" width="6" height="4" rx="0.5" strokeWidth="1" />
      </svg>
      
      {/* Battery fill animation */}
      {isCharging && (
        <svg 
          className="absolute top-0 left-0"
          width="48" 
          height="48" 
          viewBox="0 0 24 24"
        >
          <defs>
            <clipPath id="batteryClip">
              <rect x="9.5" y="8.5" width="5" height="3" rx="0.3" />
            </clipPath>
          </defs>
          <g clipPath="url(#batteryClip)">
            <motion.rect
              x="9.5"
              y="8.5"
              width="5"
              height="3"
              fill={color}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: [0.2, 0.4, 0.6, 0.8, 1, 0.2] }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{ originX: 0 }}
            />
          </g>
        </svg>
      )}
      
      {/* Charging bolt indicator */}
      {isCharging && (
        <motion.div
          className="absolute -top-1 -right-1"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        >
          <BatteryCharging 
            className="w-4 h-4" 
            style={{ color }} 
          />
        </motion.div>
      )}
    </div>
  );
}

export function EnergyFlowVisualization({ mode }: EnergyFlowVisualizationProps) {
  const config = modeConfig[mode];

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
              <AnimatedCar color={config.color} isCharging={false} />
            </div>
          )}
          <span className="text-xs text-muted-foreground">
            {mode === "charging" ? "Laddbox" : "Bil"}
          </span>
        </motion.div>

        {/* Animated pulses */}
        <div className="flex-1 flex items-center justify-center relative h-8 mx-2">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full"
              style={{ backgroundColor: config.color }}
              initial={{ x: -20, opacity: 0 }}
              animate={{
                x: ["-100%", "200%"],
                opacity: [0, 1, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeInOut",
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
          className="flex flex-col items-center gap-2"
        >
          <motion.div
            animate={{
              boxShadow: [
                `0 0 0 0 ${config.color}00`,
                `0 0 20px 5px ${config.color}30`,
                `0 0 0 0 ${config.color}00`,
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="p-3 rounded-2xl"
            style={{ backgroundColor: `${config.color}15` }}
          >
            {mode === "charging" && (
              <AnimatedCar color={config.color} isCharging={true} />
            )}
            {mode === "v2h" && (
              <Home className="w-8 h-8" style={{ color: config.color }} />
            )}
            {mode === "v2g" && (
              <Building2 className="w-8 h-8" style={{ color: config.color }} />
            )}
          </motion.div>
          <span className="text-xs text-muted-foreground">
            {mode === "charging" ? "Bil" : mode === "v2h" ? "Hem" : "Elnät"}
          </span>
        </motion.div>
      </div>

      {/* Battery level indicator for charging mode */}
      {mode === "charging" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 w-full max-w-[200px]"
        >
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Batterinivå</span>
            <motion.span
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Laddar...
            </motion.span>
          </div>
          <div className="h-2 bg-muted/30 rounded-full overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: config.color }}
              initial={{ width: "45%" }}
              animate={{ width: ["45%", "48%", "52%", "55%", "58%", "55%", "52%", "48%", "45%"] }}
              transition={{
                duration: 8,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-muted-foreground">~52%</span>
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
        <span className="text-2xl font-semibold text-foreground">7.2</span>
        <span className="text-muted-foreground ml-1">kW</span>
      </motion.div>
    </div>
  );
}
