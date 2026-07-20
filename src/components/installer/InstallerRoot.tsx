import Settings from "@/pages/Settings";
import type { BackgroundOption } from "@/hooks/useBackground";
import type { UseInstallerDataResult } from "@/hooks/useInstallerData";
import { InstallerHemTab } from "./InstallerHemTab";
import { InstallerDashTab } from "./InstallerDashTab";
import { InstallerProfilTab } from "./InstallerProfilTab";
import { InstallerAddFlow } from "./InstallerAddFlow";
import type { useInstallerApp } from "@/hooks/useInstallerApp";

interface InstallerRootProps {
  installer: ReturnType<typeof useInstallerApp>;
  installerData: UseInstallerDataResult;
  selectedBackground: BackgroundOption;
  onBackgroundChange: (bg: BackgroundOption) => void;
  onExitDevMode: () => void;
  onLogout?: () => void;
}

export function InstallerRoot({
  installer,
  installerData,
  selectedBackground,
  onBackgroundChange,
  onExitDevMode,
  onLogout,
}: InstallerRootProps) {
  const {
    tab,
    overlay,
    setOverlay,
    activeUnitIndex,
    setActiveUnitIndex,
    updateCurrentUnit,
    openUnit,
    setTab,
  } = installer;

  const units = installerData.units;

  if (overlay === "settings") {
    return <Settings onBack={() => setOverlay(null)} />;
  }

  if (overlay === "add") {
    return (
      <InstallerAddFlow
        companyName={installerData.company.companyName}
        onCancel={() => setOverlay(null)}
        onComplete={(result) => {
          installerData.addUnitFromApi(result.unit);
          setOverlay(null);
        }}
        createInstallation={installerData.createInstallation}
      />
    );
  }

  switch (tab) {
    case "dash":
      return (
        <InstallerDashTab
          units={units}
          fromApi={installerData.company.fromApi.installations}
          onSelectUnit={openUnit}
          onAddArc={() => setOverlay("add")}
        />
      );
    case "profil":
      return (
        <InstallerProfilTab
          company={installerData.company}
          unitCount={units.length}
          selectedBackground={selectedBackground}
          onBackgroundChange={onBackgroundChange}
          onExitDevMode={onExitDevMode}
          onLogout={onLogout}
        />
      );
    default:
      return (
        <InstallerHemTab
          units={units}
          activeIndex={activeUnitIndex}
          fromApi={installerData.company.fromApi.installations}
          onActiveIndexChange={setActiveUnitIndex}
          onUpdateUnit={updateCurrentUnit}
          onOpenSettings={() => setOverlay("settings")}
          onGoToDash={() => setTab("dash")}
        />
      );
  }
}
