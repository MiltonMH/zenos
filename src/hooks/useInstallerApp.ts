import { useState } from "react";
import { initialInstalledUnits, type InstalledUnit } from "@/lib/installer-mock-data";

export type InstallerTab = "hem" | "dash" | "profil";
export type InstallerOverlay = "settings" | "add" | null;

export function useInstallerApp() {
  const [tab, setTab] = useState<InstallerTab>("hem");
  const [overlay, setOverlay] = useState<InstallerOverlay>(null);
  const [units, setUnits] = useState<InstalledUnit[]>(initialInstalledUnits);
  const [activeUnitIndex, setActiveUnitIndex] = useState(0);

  const currentUnit: InstalledUnit | undefined = units[activeUnitIndex];

  const updateCurrentUnit = (patch: Partial<InstalledUnit>) => {
    setUnits((prev) => prev.map((u, i) => (i === activeUnitIndex ? { ...u, ...patch } : u)));
  };

  const openUnit = (index: number) => {
    setActiveUnitIndex(index);
    setTab("hem");
  };

  const addUnit = (unit: InstalledUnit) => {
    setUnits((prev) => [unit, ...prev]);
    setActiveUnitIndex(0);
  };

  return {
    tab,
    setTab,
    overlay,
    setOverlay,
    units,
    activeUnitIndex,
    setActiveUnitIndex,
    currentUnit,
    updateCurrentUnit,
    openUnit,
    addUnit,
  };
}
