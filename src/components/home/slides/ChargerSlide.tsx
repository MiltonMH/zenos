import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, LockOpen, Clock, Home, LucideIcon } from "lucide-react";
import chargerBoxImage from "@/assets/charger-box.png";
import { EnergyFlowVisualization } from "../EnergyFlowVisualization";

interface ChargerSlideProps {
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

  return (
    <div className="h-full flex flex-col items-center px-6 pt-4 pb-8">
      {/* Connection indicator */}
      <div className="mb-2">
        <div className={`w-2.5 h-2.5 rounded-full ${mode === "idle" ? "bg-muted-foreground" : "bg-primary status-pulse"}`} />
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
              <EnergyFlowVisualization mode={mode} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 w-full justify-center mt-4">
        <ActionButton
          icon={isLocked ? Lock : LockOpen}
          label="Lås"
          sublabel={isLocked ? "Låst" : "Olåst"}
          isActive={!isLocked}
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
      className="flex flex-col items-center gap-1.5 px-5 py-3 glass rounded-2xl min-w-[85px]"
    >
      <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-[11px] text-muted-foreground">{sublabel}</span>
    </motion.button>
  );
}
