import { useState } from "react";
import { motion } from "framer-motion";
import { Home, LayoutGrid, User } from "lucide-react";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { AppBottomNav, type NavItem } from "@/components/layout/AppBottomNav";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import { HomeBatteryWater } from "@/components/home/HomeBatteryWater";
import { ChargingScheduleModal } from "@/components/schedule/ChargingScheduleModal";
import Profile from "./Profile";
import Settings from "./Settings";
import Statistics from "./Statistics";
import { mockUser } from "@/lib/mock-data";
import { useBackground } from "@/hooks/useBackground";
import { useAppMode } from "@/hooks/useAppMode";
import { useInstallerApp, type InstallerTab } from "@/hooks/useInstallerApp";
import { InstallerRoot } from "@/components/installer/InstallerRoot";
import { cn } from "@/lib/utils";

const installerNavItems: NavItem[] = [
  { id: "hem", icon: Home, label: "Hem" },
  { id: "dash", icon: LayoutGrid, label: "Dash" },
  { id: "profil", icon: User, label: "Profil" },
];

function SlideIndicators({ currentSlide, onChange }: { currentSlide: "charger" | "stats" | "price"; onChange: (slide: "charger" | "stats" | "price") => void }) {
  const slides = ["charger", "stats", "price"] as const;

  return (
    <div className="flex items-center justify-center gap-2">
      {slides.map((slide) => (
        <button
          key={slide}
          type="button"
          onClick={() => onChange(slide)}
          className={`h-2 rounded-full transition-all duration-300 ${
            currentSlide === slide ? "w-3 bg-primary" : "w-2 bg-primary/30"
          }`}
          aria-label={`Visa ${slide}`}
        />
      ))}
    </div>
  );
}

interface IndexProps {
  onLogout?: () => void;
}

export default function Index({ onLogout }: IndexProps) {
  const [activeTab, setActiveTab] = useState("home");
  const [showSettings, setShowSettings] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [chargingMode, setChargingMode] = useState<"idle" | "charging" | "v2h" | "v2g" | "disconnected">("idle");
  const [batteryLevel, setBatteryLevel] = useState(50);
  const [activeHomeSlide, setActiveHomeSlide] = useState<"charger" | "stats" | "price">("charger");

  const isEnergyHomeView =
    activeTab === "home" &&
    activeHomeSlide === "charger" &&
    (chargingMode === "charging" || chargingMode === "v2h" || chargingMode === "v2g");

  const handleBatteryLevelChange = (nextLevel: number) => {
    setBatteryLevel(Math.max(0, Math.min(100, nextLevel)));
  };
  const displayBatteryLevel = chargingMode === "charging" ? 80 : batteryLevel;
  const { selected, setSelected, current } = useBackground();
  const { mode, toggleMode } = useAppMode();
  const installer = useInstallerApp();

  const isInstallerEnergyActive =
    installer.tab === "hem" &&
    !installer.overlay &&
    ["charging", "v2h", "v2g"].includes(installer.currentUnit?.chargingMode ?? "idle");

  const renderContent = () => {
    if (showSettings) {
      return <Settings onBack={() => setShowSettings(false)} />;
    }

    switch (activeTab) {
      case "profile":
        return (
          <Profile
            selectedBackground={selected}
            onBackgroundChange={setSelected}
            appMode={mode}
            onToggleAppMode={toggleMode}
            onLogout={onLogout}
          />
        );
      case "statistics":
        return <Statistics />;
      case "settings":
        return <Settings onBack={() => setActiveTab("home")} />;
      default:
        return (
          <>
            <HomeHeader
              userName={mockUser.firstName}
              isOnline={true}
              onSettingsClick={() => setShowSettings(true)}
              centerContent={
                <SlideIndicators currentSlide={activeHomeSlide} onChange={setActiveHomeSlide} />
              }
            />
            <HomeCarousel
              userName={mockUser.firstName}
              batteryLevel={displayBatteryLevel}
              chargingMode={chargingMode}
              onModeChange={setChargingMode}
              onBatteryLevelChange={handleBatteryLevelChange}
              onScheduleClick={() => setShowSchedule(true)}
              activeSlide={activeHomeSlide}
              onSlideChange={setActiveHomeSlide}
            />
          </>
        );
    }
  };

  if (mode === "installer") {
    return (
      <div
        className={cn("min-h-dvh flex flex-col", current.style)}
        style={current.image ? {
          backgroundImage: `url(${current.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        } : undefined}
      >
        <div className="flex-1 flex flex-col px-5 safe-top pb-40">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "relative isolate flex-1 glass-main flex flex-col overflow-hidden",
              isInstallerEnergyActive && "glass-main-energy-active"
            )}
          >
            {isInstallerEnergyActive && installer.currentUnit && (
              <HomeBatteryWater
                batteryLevel={installer.currentUnit.batteryLevel}
                mode={installer.currentUnit.chargingMode as "charging" | "v2h" | "v2g"}
              />
            )}
            <div className="relative z-10 flex-1 flex flex-col min-h-0">
              <InstallerRoot installer={installer} onExitDevMode={toggleMode} />
            </div>
          </motion.div>
        </div>

        {!installer.overlay && (
          <AppBottomNav
            items={installerNavItems}
            activeTab={installer.tab}
            onTabChange={(tab) => installer.setTab(tab as InstallerTab)}
          />
        )}
      </div>
    );
  }

  return (
    <div
      className={cn("min-h-dvh flex flex-col", current.style)}
      style={current.image ? {
        backgroundImage: `url(${current.image})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } : undefined}
    >
      {/* Main Card Container */}
      <div className="flex-1 flex flex-col px-5 safe-top pb-40">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            "relative isolate flex-1 glass-main flex flex-col overflow-hidden",
            isEnergyHomeView && "glass-main-energy-active"
          )}
        >
          {isEnergyHomeView && (
            <HomeBatteryWater batteryLevel={displayBatteryLevel} mode={chargingMode} />
          )}
          <div className="relative z-10 flex-1 flex flex-col">
            {renderContent()}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      {!showSettings && (
        <AppBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
      )}

      {/* Schedule Modal */}
      <ChargingScheduleModal
        isOpen={showSchedule}
        onClose={() => setShowSchedule(false)}
      />
    </div>
  );
}
