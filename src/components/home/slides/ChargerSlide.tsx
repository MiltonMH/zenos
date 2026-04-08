import { useCallback, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LockOpen, Clock, Home, Unplug, LucideIcon } from "lucide-react";
import chargerBoxImage from "@/assets/charger-box.png";
import { EnergyFlowVisualization } from "../EnergyFlowVisualization";
import { cn } from "@/lib/utils";

const CHARGER_LOCK_STORAGE_KEY = "zenos-home-charger-locked";

interface ChargerSlideProps {
  mode: "idle" | "charging" | "v2h" | "v2g" | "disconnected";
  onModeChange: (mode: "idle" | "charging" | "v2h" | "v2g" | "disconnected") => void;
  onScheduleClick?: () => void;
  batteryLevel?: number;
  onBatteryLevelChange?: (level: number) => void;
}

export function ChargerSlide({ mode, onModeChange, onScheduleClick, batteryLevel, onBatteryLevelChange }: ChargerSlideProps) {
  const isEnergyMode = mode === "charging" || mode === "v2h" || mode === "v2g";

  const [isLocked, setIsLocked] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.localStorage.getItem(CHARGER_LOCK_STORAGE_KEY) === "true";
  });

  useEffect(() => {
    window.localStorage.setItem(CHARGER_LOCK_STORAGE_KEY, String(isLocked));
  }, [isLocked]);

  // Cycle through all modes for simulation
  const cycleMode = useCallback(() => {
    const modes: Array<"idle" | "charging" | "v2h" | "v2g" | "disconnected"> = ["idle", "charging", "v2h", "v2g", "disconnected"];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onModeChange(modes[nextIndex]);
  }, [mode, onModeChange]);

  const getModeLabel = () => {
    switch (mode) {
      case "idle": return "Idle";
      case "charging": return "Ladda";
      case "v2h": return "V2H";
      case "v2g": return "V2G";
      case "disconnected": return "Offline";
    }
  };

  return (
    <div className="h-full flex flex-col items-center pt-4 pb-4 max-h-sm:pb-2">
      {/* Connection indicator */}
      <div className="mb-2 flex flex-col items-center gap-1.5">
        <div className={`w-2.5 h-2.5 rounded-full ${
          mode === "disconnected" ? "bg-destructive"
          : mode === "idle" ? "bg-muted-foreground"
          : "bg-primary status-pulse"
        }`} />
        {isEnergyMode && batteryLevel !== undefined && (
          <span className={`font-bold text-foreground ${batteryLevel === 100 ? "text-4xl" : "text-xl"}`}>{Math.round(batteryLevel)}%</span>
        )}
      </div>

      {/* Content area - either static image or dynamic visualization */}
      <div className="flex-1 min-h-0 flex items-center justify-center w-full relative overflow-hidden">
        <AnimatePresence mode="wait">
          {mode === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              {/* Product image */}
              <img
                src={chargerBoxImage}
                alt="ZenBox Charger"
                draggable={false}
                className="relative w-20 mobile-lg:w-36 max-w-[50vw] h-auto"
              />
            </motion.div>
          ) : mode === "disconnected" ? (
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative flex flex-col items-center gap-3"
            >
              {/* Product image — desaturated and dimmed */}
              <div className="relative">
                <img
                  src={chargerBoxImage}
                  alt="ZenBox Charger"
                  draggable={false}
                  className="relative w-20 mobile-lg:w-36 max-w-[50vw] h-auto grayscale opacity-100"
                />
                {/* Unplug badge */}
                <div className="absolute -bottom-3 -right-3 max-h-sm:-bottom-1 max-h-sm:-right-1 bg-destructive rounded-full p-1.5 shadow-lg">
                  <Unplug className="w-4 h-4 text-white" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full relative z-10"
            >
              {["charging", "v2h", "v2g"].includes(mode) && (
                <EnergyFlowVisualization mode={mode as "charging" | "v2h" | "v2g"} batteryLevel={batteryLevel} />
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 w-full justify-center mt-2">
        <ActionButton
          icon={isLocked ? Lock : LockOpen}
          label="Lås"
          sublabel={isLocked ? "Låst" : "Olåst"}
          isActive={isLocked}
          isFrosty={isEnergyMode}
          iconClassName={isLocked ? "text-primary" : "text-muted-foreground"}
          onClick={() => setIsLocked(!isLocked)}
        />
        <ActionButton
          icon={Home}
          label="Läge"
          sublabel={getModeLabel()}
          isActive={mode !== "idle"}
          isFrosty={isEnergyMode}
          onClick={cycleMode}
        />
        <ActionButton
          icon={Clock}
          label="Schema"
          sublabel="Auto"
          isActive={true}
          isFrosty={isEnergyMode}
          onClick={onScheduleClick || (() => {})}
        />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  isActive: boolean;
  isFrosty?: boolean;
  iconClassName?: string;
  onClick: () => void;
}

function ActionButton({ icon: Icon, label, sublabel, isActive, isFrosty = false, iconClassName, onClick }: ActionButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-center gap-1.5 rounded-2xl max-h-sm:rounded-sm overflow-hidden",
        isFrosty
          ? "bg-white/45 backdrop-blur-xl border border-white/60 shadow-[inset_0_1px_0_rgba(255,255,255,0.78),0_8px_20px_rgba(0,0,0,0.06)]"
          : "bg-white/30 border border-white/40",
        "w-[98px] h-[100px] max-h-sm:w-[76px] max-h-sm:h-[80px] min-w-0 p-0"
      )}
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    >
      <Icon
        className={cn(
          "w-6 h-6 max-h-sm:w-5 max-h-sm:h-5 mx-auto my-0 relative z-10",
          isActive ? "text-primary" : "text-muted-foreground",
          iconClassName,
        )}
      />
      <span className="text-[14px] max-h-sm:text-[12px] font-medium text-foreground relative z-10 text-center truncate w-full px-1">{label}</span>
      <span className="text-[14px] max-h-sm:text-[12px] text-muted-foreground relative z-10 text-center truncate w-full px-1">{sublabel}</span>
    </motion.button>
  );
}
