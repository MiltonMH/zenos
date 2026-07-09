import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { ChargerSlide } from "@/components/home/slides/ChargerSlide";
import { ChargingScheduleModal } from "@/components/schedule/ChargingScheduleModal";
import type { InstalledUnit } from "@/lib/installer-mock-data";

interface InstallerHemTabProps {
  units: InstalledUnit[];
  activeIndex: number;
  onActiveIndexChange: (index: number) => void;
  onUpdateUnit: (patch: Partial<InstalledUnit>) => void;
  onOpenSettings: () => void;
  onGoToDash: () => void;
}

const variants = {
  enter: (direction: number) => ({ x: direction > 0 ? 300 : -300, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction: number) => ({ x: direction < 0 ? 300 : -300, opacity: 0 }),
};

export function InstallerHemTab({
  units,
  activeIndex,
  onActiveIndexChange,
  onUpdateUnit,
  onOpenSettings,
  onGoToDash,
}: InstallerHemTabProps) {
  const [direction, setDirection] = useState(0);
  const [showSchedule, setShowSchedule] = useState(false);

  const goTo = (next: number) => {
    if (next < 0 || next >= units.length) return;
    setDirection(next > activeIndex ? 1 : -1);
    onActiveIndexChange(next);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    const startX = e.clientX;
    const startY = e.clientY;
    let endX = startX;
    let endY = startY;

    const onMove = (ev: PointerEvent) => {
      endX = ev.clientX;
      endY = ev.clientY;
    };

    const onUp = () => {
      document.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerup", onUp);
      document.removeEventListener("pointercancel", onUp);

      const diffX = startX - endX;
      const diffY = startY - endY;
      if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
        if (diffX > 0) goTo(activeIndex + 1);
        else goTo(activeIndex - 1);
      }
    };

    document.addEventListener("pointermove", onMove);
    document.addEventListener("pointerup", onUp);
    document.addEventListener("pointercancel", onUp);
  };

  const unit = units[activeIndex];

  if (!unit) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-sm text-muted-foreground">Inga installationer än.</p>
        <button onClick={onGoToDash} className="text-sm text-primary font-medium">
          Gå till Dash för att lägga till en
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <HomeHeader
        userName={unit.customerName}
        isOnline={unit.online}
        onSettingsClick={onOpenSettings}
        centerContent={
          <div className="text-center leading-tight">
            <p className="text-sm font-semibold text-foreground">{unit.customerName}</p>
            <p className="text-[11px] text-muted-foreground">{unit.address}</p>
          </div>
        }
      />

      <div
        className="flex-1 min-h-0 relative overflow-hidden"
        onPointerDown={handlePointerDown}
        style={{ touchAction: "pan-y", userSelect: "none" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={unit.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-0"
          >
            <ChargerSlide
              mode={unit.chargingMode}
              onModeChange={(mode) => onUpdateUnit({ chargingMode: mode })}
              onScheduleClick={() => setShowSchedule(true)}
              batteryLevel={unit.batteryLevel}
              onBatteryLevelChange={(level) => onUpdateUnit({ batteryLevel: level })}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {units.length > 1 && (
        <div className="flex items-center justify-center gap-1.5 pb-1">
          {units.map((u, i) => (
            <button
              key={u.id}
              onClick={() => goTo(i)}
              aria-label={`Visa ${u.customerName}`}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-5 bg-primary" : "w-1.5 bg-primary/25"
              }`}
            />
          ))}
        </div>
      )}

      <ChargingScheduleModal isOpen={showSchedule} onClose={() => setShowSchedule(false)} />
    </div>
  );
}
