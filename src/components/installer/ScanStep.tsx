import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ScanLine, CheckCircle2, Plug } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GlassCard } from "@/components/ui/glass-card";
import { InstallerStepHeader } from "./InstallerStepHeader";

interface ScanStepProps {
  onBack: () => void;
  onConfigure: () => void;
}

type ScanPhase = "idle" | "scanning" | "found";

export function ScanStep({ onBack, onConfigure }: ScanStepProps) {
  const [phase, setPhase] = useState<ScanPhase>("idle");

  const handleSimulateScan = () => {
    setPhase("scanning");
    setTimeout(() => setPhase("found"), 1400);
  };

  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-2 pb-4">
      <InstallerStepHeader title="Skanna QR" onBack={onBack} stepIndex={0} stepCount={3} />

      <div className="flex-1 flex flex-col items-center justify-center gap-6">
        <div className="relative w-56 h-56 rounded-3xl bg-black/85 overflow-hidden flex items-center justify-center">
          {/* corner brackets */}
          {["top-3 left-3 border-t-2 border-l-2", "top-3 right-3 border-t-2 border-r-2", "bottom-3 left-3 border-b-2 border-l-2", "bottom-3 right-3 border-b-2 border-r-2"].map(
            (pos, i) => (
              <div key={i} className={`absolute w-6 h-6 rounded-sm border-primary ${pos}`} />
            )
          )}

          <AnimatePresence mode="wait">
            {phase === "idle" && (
              <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <ScanLine className="w-10 h-10 text-white/40" />
              </motion.div>
            )}
            {phase === "scanning" && (
              <motion.div
                key="scanning"
                initial={{ y: -70, opacity: 0 }}
                animate={{ y: [-70, 70, -70], opacity: 1 }}
                transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute left-4 right-4 h-0.5 bg-primary shadow-[0_0_12px_2px] shadow-primary/60"
              />
            )}
            {phase === "found" && (
              <motion.div
                key="found"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <CheckCircle2 className="w-14 h-14 text-success" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <p className="text-sm text-muted-foreground text-center max-w-[240px]">
          {phase === "found"
            ? "Laddbox hittad"
            : "Rikta kameran mot QR-koden på laddboxen"}
        </p>

        <AnimatePresence mode="wait">
          {phase !== "found" ? (
            <motion.div key="scan-btn" exit={{ opacity: 0 }} className="w-full max-w-[280px]">
              <Button
                onClick={handleSimulateScan}
                disabled={phase === "scanning"}
                className="w-full h-11 rounded-xl"
              >
                {phase === "scanning" ? "Skannar…" : "Simulera skanning"}
              </Button>
            </motion.div>
          ) : (
            <motion.div
              key="found-card"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full max-w-[280px] space-y-3"
            >
              <GlassCard className="p-3" variant="subtle">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Plug className="w-4 h-4 text-primary" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground">Zenion Arc</p>
                    <p className="text-xs text-muted-foreground">Serienr ZEN-2026-QF81K</p>
                  </div>
                </div>
              </GlassCard>
              <Button onClick={onConfigure} className="w-full h-11 rounded-xl">
                Konfigurera
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
