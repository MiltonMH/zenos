import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LockOpen, Clock, Home, LucideIcon } from "lucide-react";
import chargerBoxImage from "@/assets/charger-box.png";
import { EnergyFlowVisualization } from "../EnergyFlowVisualization";

interface ChargerSlideProps {
  batteryLevel: number;
  mode: "idle" | "charging" | "v2h" | "v2g";
  onModeChange: (mode: "idle" | "charging" | "v2h" | "v2g") => void;
  onScheduleClick?: () => void;
}

export function ChargerSlide({ mode, onModeChange, onScheduleClick }: ChargerSlideProps) {
  const [isLocked, setIsLocked] = useState(false);

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

  const handleSetBatteryLevel = () => {
    const nextLevel = window.prompt("Set battery percentage (0-100)", String(Math.round(batteryLevel)));

    if (nextLevel === null) {
      return;
    }

    const parsedLevel = Number(nextLevel.trim());

    if (!Number.isFinite(parsedLevel)) {
      return;
    }

    onBatteryLevelChange(parsedLevel);
  };

  return (
    <div className="h-full flex flex-col items-center px-6 pt-4 pb-8">
      {mode !== "idle" && (
        <div className="relative z-10 mb-5 flex items-center gap-2 text-foreground/95">
          <div className="h-4 w-4 rounded-full bg-primary status-pulse" />
          <span className="text-[2rem] font-semibold leading-none">{Math.round(batteryLevel)}%</span>
          {mode === "charging" && (
            <span className="ml-1 text-sm font-medium text-primary/90">Laddar</span>
          )}
          <button
            type="button"
            onClick={handleSetBatteryLevel}
            className="ml-2 rounded-full border border-white/15 bg-black/10 px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.18em] text-foreground/75 transition hover:bg-black/15"
          >
            Set %
          </button>
        </div>
      )}

      {/* Content area - either static image or dynamic visualization */}
      <div className="relative z-10 flex-1 flex items-center justify-center w-full overflow-hidden rounded-[2rem]">
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
              <EnergyFlowVisualization batteryLevel={batteryLevel} mode={mode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="relative z-10 flex gap-5 w-full justify-center mt-4">
        <ActionButton
          icon={isLocked ? Lock : LockOpen}
          label="Lås"
          sublabel={isLocked ? "Låst" : "Olåst"}
          isActive={isLocked}
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
  onClick: () => void;
}

function ActionButton({ icon: Icon, label, sublabel, isActive, onClick }: ActionButtonProps) {
  return (
     <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className="relative flex flex-col items-center gap-1.5 px-5 py-3 rounded-2xl min-w-[85px] bg-white/30 border border-white/40"
    >
      <Icon className={`w-5 h-5 relative z-10 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-sm font-medium text-foreground relative z-10">{label}</span>
      <span className="text-[11px] text-muted-foreground relative z-10">{sublabel}</span>
    </motion.button>
  );
}
