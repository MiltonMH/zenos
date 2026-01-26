import { motion } from "framer-motion";
import { Zap, Lock, Clock, Home } from "lucide-react";

interface ChargerSlideProps {
  mode: "idle" | "charging" | "v2h" | "v2g";
  onModeChange: (mode: "idle" | "charging" | "v2h" | "v2g") => void;
}

export function ChargerSlide({ mode, onModeChange }: ChargerSlideProps) {
  const isLocked = false; // Mock state

  return (
    <div className="h-full flex flex-col items-center justify-center px-6">
      {/* Connection indicator */}
      <div className="mb-6">
        <div className="w-2.5 h-2.5 rounded-full bg-primary status-pulse" />
      </div>

      {/* Charger Box */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="glass-dark rounded-3xl p-8 relative mb-8"
      >
        {/* Charger icon with glow */}
        <div className="relative">
          <motion.div
            animate={mode === "charging" ? { opacity: [0.3, 0.6, 0.3] } : { opacity: 0.2 }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 blur-xl bg-primary/30 rounded-full"
          />
          <div className="relative w-24 h-32 flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-transparent rounded-2xl" />
            <Zap className={`w-10 h-10 ${mode === "charging" ? "text-primary" : "text-white/60"}`} />
          </div>
        </div>

        {/* Status indicator bar */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-1 h-6 bg-white/20 rounded-full overflow-hidden">
          {mode === "charging" && (
            <motion.div
              className="w-full bg-primary rounded-full"
              animate={{ height: ["0%", "100%", "0%"] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
          )}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <div className="flex gap-4">
        <ActionButton
          icon={Lock}
          label="Unlock"
          sublabel={isLocked ? "Locked" : "Unlocked"}
          isActive={!isLocked}
          onClick={() => {}}
        />
        <ActionButton
          icon={Home}
          label="Mode"
          sublabel={mode === "v2h" ? "V2H" : mode === "v2g" ? "V2G" : "Charge"}
          isActive={mode !== "idle"}
          onClick={() => onModeChange(mode === "charging" ? "v2h" : "charging")}
        />
        <ActionButton
          icon={Clock}
          label="Schedule"
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
      className="flex flex-col items-center gap-1.5 px-5 py-3 glass-subtle rounded-2xl min-w-[80px]"
    >
      <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground"}`} />
      <span className="text-sm font-medium text-foreground">{label}</span>
      <span className="text-xs text-muted-foreground">{sublabel}</span>
    </motion.button>
  );
}
