import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LockOpen, Clock, Home, LucideIcon } from "lucide-react";
import chargerBoxImage from "@/assets/charger-box.png";
import { EnergyFlowVisualization } from "../EnergyFlowVisualization";
import { cn } from "@/lib/utils";

const CHARGER_LOCK_STORAGE_KEY = "zenos-home-charger-locked";

interface ChargerSlideProps {
  mode: "idle" | "charging" | "v2h" | "v2g";
  onModeChange: (mode: "idle" | "charging" | "v2h" | "v2g") => void;
  onScheduleClick?: () => void;
  batteryLevel?: number;
  onBatteryLevelChange?: (level: number) => void;
}

export function ChargerSlide({ mode, onModeChange, onScheduleClick, batteryLevel, onBatteryLevelChange }: ChargerSlideProps) {
  const applyTestLevel = () => {
    const input = window.prompt("Enter battery percentage (0–100):");
    if (input === null) return;
    const parsed = parseInt(input, 10);
    if (!isNaN(parsed) && onBatteryLevelChange) {
      onBatteryLevelChange(Math.max(0, Math.min(100, parsed)));
    }
  };
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
  const cycleMode = () => {
    const modes: Array<"idle" | "charging" | "v2h" | "v2g"> = ["idle", "charging", "v2h", "v2g"];
    const currentIndex = modes.indexOf(mode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onModeChange(modes[nextIndex]);
  };

  const getModeLabel = () => {
    switch (mode) {
      case "idle": return "Idle";
      case "charging": return "Ladda";
      case "v2h": return "V2H";
      case "v2g": return "V2G";
    }
  };

  return (
    <div className="h-full flex flex-col items-center px-6 pt-4 pb-8">
      {/* Connection indicator */}
      <div className="mb-2 flex flex-col items-center gap-1.5">
        <div className={`w-2.5 h-2.5 rounded-full ${mode === "idle" ? "bg-muted-foreground" : "bg-primary status-pulse"}`} />
        {mode !== "idle" && batteryLevel !== undefined && (
          <span className="text-xl font-bold text-foreground">{batteryLevel}%</span>
        )}
      </div>

      {/* Content area - either static image or dynamic visualization */}
      <div className="flex-1 flex items-center justify-center w-full">
        <AnimatePresence mode="wait">
          {mode === "idle" ? (
            <motion.div
              key="idle"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative"
            >
              {/* Glow effect behind charger */}
              <div className="absolute inset-0 blur-2xl bg-primary/10 rounded-full scale-110" />

              {/* Product image */}
              <img
                src={chargerBoxImage}
                alt="ZenBox Charger"
                className="relative w-36 max-w-[50vw] h-auto drop-shadow-2xl"
              />
            </motion.div>
          ) : (
            <motion.div
              key="active"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="w-full h-full"
            >
              <EnergyFlowVisualization mode={mode} batteryLevel={batteryLevel} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Test battery setter — only on active (non-idle) modes */}
      {mode !== "idle" && onBatteryLevelChange && (
        <button
          type="button"
          onClick={applyTestLevel}
          className="mt-3 rounded-lg bg-primary/20 px-4 py-1.5 text-xs font-medium text-primary"
        >
          Set battery %
        </button>
      )}

      {/* Quick Actions */}
      <div className="flex gap-3 w-full justify-center mt-4">
        <ActionButton
          icon={isLocked ? Lock : LockOpen}
          label="Lås"
          sublabel={isLocked ? "Låst" : "Olåst"}
          isActive={isLocked}
          iconClassName={isLocked ? "text-primary" : "text-muted-foreground"}
          onClick={() => setIsLocked(!isLocked)}
        />
        <ActionButton
          icon={Home}
          label="Läge"
          sublabel={getModeLabel()}
          isActive={mode !== "idle"}
          onClick={cycleMode}
        />
        <ActionButton
          icon={Clock}
          label="Schema"
          sublabel="Auto"
          isActive={true}
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
  iconClassName?: string;
  onClick: () => void;
}

function ActionButton({ icon: Icon, label, sublabel, isActive, iconClassName, onClick }: ActionButtonProps) {
  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={
        cn(
          // Fixed size on mobile, responsive on larger screens
          "relative flex flex-col items-center justify-center gap-1.5 bg-white/30 border border-white/40 rounded-2xl overflow-hidden",
          "w-[98px] h-[100px] min-w-0 p-0",
          "sm:w-[110px] sm:h-[110px]"
        )
      }
      style={{ maxWidth: '100%', maxHeight: '100%' }}
    >
      <Icon
        className={cn(
          "w-6 h-6 mx-auto my-0 relative z-10",
          isActive ? "text-primary" : "text-muted-foreground",
          iconClassName,
        )}
      />
      <span className="text-sm font-medium text-foreground relative z-10 text-center truncate w-full px-1">{label}</span>
      <span className="text-[11px] text-muted-foreground relative z-10 text-center truncate w-full px-1">{sublabel}</span>
    </motion.button>
  );
}
