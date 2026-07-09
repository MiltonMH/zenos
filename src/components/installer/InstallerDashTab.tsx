import { motion } from "framer-motion";
import { Plus, MapPin, CheckCircle2, Clock, WifiOff } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { Button } from "@/components/ui/button";
import type { InstalledUnit } from "@/lib/installer-mock-data";

interface InstallerDashTabProps {
  units: InstalledUnit[];
  onSelectUnit: (index: number) => void;
  onAddArc: () => void;
}

export function InstallerDashTab({ units, onSelectUnit, onAddArc }: InstallerDashTabProps) {
  return (
    <div className="flex flex-col flex-1 min-h-0 px-4 pt-6 pb-4">
      <div className="mb-1">
        <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Dash</p>
        <h1 className="text-xl font-semibold text-foreground">Alla installationer</h1>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide py-4 space-y-2.5">
        {units.map((unit, index) => (
          <motion.button
            key={unit.id}
            type="button"
            onClick={() => onSelectUnit(index)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="w-full text-left"
          >
            <GlassCard className="p-4" variant="subtle">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{unit.customerName}</p>
                  <div className="flex items-center gap-1 mt-0.5 text-xs text-muted-foreground">
                    <MapPin className="w-3 h-3 shrink-0" />
                    <span className="truncate">{unit.address}</span>
                  </div>
                  <p className="text-[11px] text-muted-foreground/70 mt-1">Installerad {unit.installedDate}</p>
                </div>

                {unit.status === "active" ? (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-success bg-success/10 px-2 py-1 rounded-full shrink-0">
                    <CheckCircle2 className="w-3 h-3" />
                    Aktiv
                  </span>
                ) : (
                  <span className="flex items-center gap-1 text-[11px] font-medium text-warning-foreground bg-warning/20 px-2 py-1 rounded-full shrink-0">
                    <Clock className="w-3 h-3" />
                    Väntar
                  </span>
                )}
              </div>
              {!unit.online && (
                <div className="flex items-center gap-1.5 mt-2 text-[11px] text-destructive">
                  <WifiOff className="w-3 h-3" />
                  Offline
                </div>
              )}
            </GlassCard>
          </motion.button>
        ))}

        {units.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-10">Inga installationer än.</p>
        )}
      </div>

      <Button onClick={onAddArc} variant="glass" className="w-full h-12 text-base font-medium gap-2">
        <Plus className="w-5 h-5" />
        Lägg till laddbox
      </Button>
    </div>
  );
}
