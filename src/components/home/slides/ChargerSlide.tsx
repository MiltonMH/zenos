import { motion } from "framer-motion";
import { Lock, Clock, Home } from "lucide-react";
import chargerBoxImage from "@/assets/charger-box.png";

interface ChargerSlideProps {
  mode: "idle" | "charging" | "v2h" | "v2g";
  onModeChange: (mode: "idle" | "charging" | "v2h" | "v2g") => void;
}

export function ChargerSlide({ mode, onModeChange }: ChargerSlideProps) {
  const isLocked = false; // Mock state

  return (
    <div className="h-full flex flex-col items-center px-6 pt-4 pb-8">
      {/* Connection indicator */}
      <div className="mb-2">
        <div className="w-2.5 h-2.5 rounded-full bg-primary status-pulse" />
      </div>

      {/* Charger Box - Product Image */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="relative mb-6"
      >
        {/* Glow effect behind charger */}
        <motion.div
          animate={mode === "charging" ? { opacity: [0.2, 0.4, 0.2] } : { opacity: 0.1 }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute inset-0 blur-2xl bg-primary/20 rounded-full scale-110"
        />
        
        {/* Product image */}
        <img 
          src={chargerBoxImage} 
          alt="ZenBox Charger" 
          className="relative w-36 max-w-[50vw] h-auto drop-shadow-2xl"
        />
      </motion.div>

      {/* Spacer to push buttons down */}
      <div className="flex-1" />

      {/* Quick Actions */}
      <div className="flex gap-3 w-full justify-center">
        <ActionButton
          icon={Lock}
          label="Lås"
          sublabel={isLocked ? "Låst" : "Olåst"}
          isActive={!isLocked}
          onClick={() => {}}
        />
        <ActionButton
          icon={Home}
          label="Läge"
          sublabel={mode === "v2h" ? "V2H" : mode === "v2g" ? "V2G" : "Ladda"}
          isActive={mode !== "idle"}
          onClick={() => onModeChange(mode === "charging" ? "v2h" : "charging")}
        />
        <ActionButton
          icon={Clock}
          label="Schema"
          sublabel="Auto"
          isActive={true}
          onClick={() => {}}
        />
      </div>
    </div>
  );
}

interface ActionButtonProps {
  icon: typeof Lock;
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
