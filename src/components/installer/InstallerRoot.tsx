import Settings from "@/pages/Settings";
import { InstallerHemTab } from "./InstallerHemTab";
import { InstallerDashTab } from "./InstallerDashTab";
import { InstallerProfilTab } from "./InstallerProfilTab";
import { InstallerAddFlow } from "./InstallerAddFlow";
import type { useInstallerApp } from "@/hooks/useInstallerApp";

interface InstallerRootProps {
  installer: ReturnType<typeof useInstallerApp>;
  onExitDevMode: () => void;
}

export function InstallerRoot({ installer, onExitDevMode }: InstallerRootProps) {
  const {
    tab,
    overlay,
    setOverlay,
    units,
    activeUnitIndex,
    setActiveUnitIndex,
    updateCurrentUnit,
    addUnit,
    openUnit,
    setTab,
  } = installer;

  if (overlay === "settings") {
    return <Settings onBack={() => setOverlay(null)} />;
  }

  if (overlay === "add") {
    return (
      <InstallerAddFlow
        onCancel={() => setOverlay(null)}
        onComplete={(unit) => {
          addUnit(unit);
          setOverlay(null);
        }}
      />
    );
  }

  switch (tab) {
    case "dash":
      return <InstallerDashTab units={units} onSelectUnit={openUnit} onAddArc={() => setOverlay("add")} />;
    case "profil":
      return <InstallerProfilTab unitCount={units.length} onExitDevMode={onExitDevMode} />;
    default:
      return (
        <InstallerHemTab
          units={units}
          activeIndex={activeUnitIndex}
          onActiveIndexChange={setActiveUnitIndex}
          onUpdateUnit={updateCurrentUnit}
          onOpenSettings={() => setOverlay("settings")}
          onGoToDash={() => setTab("dash")}
        />
      );
  }
}
