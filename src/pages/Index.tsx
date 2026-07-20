import { useEffect, useRef, useState } from "react";
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
import { useSiteData } from "@/hooks/useSiteData";
import { useBackground } from "@/hooks/useBackground";
import { useAppMode } from "@/hooks/useAppMode";
import { useInstallerApp, type InstallerTab } from "@/hooks/useInstallerApp";
import { useInstallerData } from "@/hooks/useInstallerData";
import { toast } from "@/hooks/use-toast";
import { InstallerRoot } from "@/components/installer/InstallerRoot";
import { NumizForbiddenError, verifyInstallerAccess } from "@/lib/numiz-api";
import { getProfileTexts } from "@/lib/profile-i18n";
import { cn } from "@/lib/utils";
import { formatMessage, useLanguage } from "@/lib/i18n";
import { getNavTexts } from "@/lib/nav-i18n";

function SlideIndicators({ currentSlide, onChange }: { currentSlide: "charger" | "stats" | "price"; onChange: (slide: "charger" | "stats" | "price") => void }) {
  const { language } = useLanguage();
  const nav = getNavTexts(language);
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
          aria-label={formatMessage(nav.ariaShowSlide, { slide })}
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
  const { language } = useLanguage();
  const nav = getNavTexts(language);
  const profileTexts = getProfileTexts(language);

  const installerNavItems: NavItem[] = [
    { id: "hem", icon: Home, label: nav.home },
    { id: "dash", icon: LayoutGrid, label: nav.dash },
    { id: "profil", icon: User, label: nav.profile },
  ];

  const isEnergyHomeView =
    activeTab === "home" &&
    activeHomeSlide === "charger" &&
    (chargingMode === "charging" || chargingMode === "v2h" || chargingMode === "v2g");

  const handleBatteryLevelChange = (nextLevel: number) => {
    setBatteryLevel(Math.max(0, Math.min(100, nextLevel)));
  };
  const displayBatteryLevel = chargingMode === "charging" ? 80 : batteryLevel;
  const { selected, setSelected, current } = useBackground();
  const { mode, setMode } = useAppMode();
  const [switchingAppMode, setSwitchingAppMode] = useState(false);
  const { me, site, loading: siteLoading, view } = useSiteData();
  const canUseInstallerApis = me?.role === "INSTALLER" || me?.role === "ADMIN";
  const installerData = useInstallerData(mode === "installer" && canUseInstallerApis);
  const installer = useInstallerApp(installerData.units);
  const autoInstallerModeHandled = useRef(false);
  const userName = view.firstName || mockUser.firstName;
  const userNameFromApi = view.fromApi.displayName || view.fromApi.email;

  useEffect(() => {
    if (siteLoading || !me) return;
    if (mode !== "installer") return;
    if (canUseInstallerApis) return;
    setMode("customer");
  }, [siteLoading, me, mode, canUseInstallerApis, setMode]);

  useEffect(() => {
    if (siteLoading || autoInstallerModeHandled.current) return;
    if (me?.role !== "INSTALLER" || site !== null) return;

    autoInstallerModeHandled.current = true;

    async function openInstallerFlow() {
      try {
        await verifyInstallerAccess();
        setMode("installer");
        toast({
          title: profileTexts.devMode.noCustomerSiteTitle,
          description: profileTexts.devMode.noCustomerSiteDescription,
        });
      } catch (error) {
        if (error instanceof NumizForbiddenError) {
          toast({
            title: profileTexts.devMode.forbiddenTitle,
            description: profileTexts.devMode.forbiddenDescription,
            variant: "destructive",
          });
          return;
        }

        toast({
          title: profileTexts.devMode.switchErrorTitle,
          description: error instanceof Error ? error.message : "REQUEST_FAILED",
          variant: "destructive",
        });
      }
    }

    void openInstallerFlow();
  }, [siteLoading, me?.role, site, setMode, profileTexts.devMode]);

  const trySwitchToCustomerView = (): boolean => {
    if (siteLoading) return false;

    if (!site) {
      toast({
        title: profileTexts.devMode.noCustomerSiteSwitchTitle,
        description: profileTexts.devMode.noCustomerSiteSwitchDescription,
        variant: "destructive",
      });
      return false;
    }

    setMode("customer");
    return true;
  };

  const handleToggleAppMode = async () => {
    if (mode === "installer") {
      trySwitchToCustomerView();
      return;
    }

    if (!canUseInstallerApis) {
      toast({
        title: profileTexts.devMode.forbiddenTitle,
        description: profileTexts.devMode.forbiddenDescription,
        variant: "destructive",
      });
      return;
    }

    setSwitchingAppMode(true);
    try {
      await verifyInstallerAccess();
      setMode("installer");
    } catch (error) {
      if (error instanceof NumizForbiddenError) {
        toast({
          title: profileTexts.devMode.forbiddenTitle,
          description: profileTexts.devMode.forbiddenDescription,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: profileTexts.devMode.switchErrorTitle,
        description: error instanceof Error ? error.message : "REQUEST_FAILED",
        variant: "destructive",
      });
    } finally {
      setSwitchingAppMode(false);
    }
  };

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
            onToggleAppMode={handleToggleAppMode}
            switchingAppMode={switchingAppMode}
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
              userName={userName}
              isOnline={true}
              onSettingsClick={() => setShowSettings(true)}
              centerContent={
                <SlideIndicators currentSlide={activeHomeSlide} onChange={setActiveHomeSlide} />
              }
            />
            <HomeCarousel
              userName={userName}
              userNameFromApi={userNameFromApi}
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

  if (mode === "installer" && canUseInstallerApis) {
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
              <InstallerRoot
                installer={installer}
                installerData={installerData}
                selectedBackground={selected}
                onBackgroundChange={setSelected}
                onExitDevMode={trySwitchToCustomerView}
                onLogout={onLogout}
              />
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
