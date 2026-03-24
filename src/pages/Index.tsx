import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { AppBottomNav } from "@/components/layout/AppBottomNav";
import { HomeBatteryWater } from "@/components/home/HomeBatteryWater";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import Profile from "./Profile";
import Statistics from "./Statistics";

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [chargingMode, setChargingMode] = useState<"idle" | "charging" | "v2h" | "v2g">("idle");
  const [batteryLevel, setBatteryLevel] = useState(50);

  const handleBatteryLevelChange = (nextLevel: number) => {
    setBatteryLevel(Math.max(0, Math.min(100, nextLevel)));
  };

  useEffect(() => {
    const interval = window.setInterval(() => {
      setBatteryLevel((currentLevel) => {
        if (chargingMode === "charging") {
          return currentLevel;
        }

        if (chargingMode === "v2h") {
          return Math.max(8, currentLevel - 0.18);
        }

        if (chargingMode === "v2g") {
          return Math.max(8, currentLevel - 0.22);
        }

        return currentLevel;
      });
    }, 1400);

    return () => window.clearInterval(interval);
  }, [chargingMode]);

  const renderContent = () => {
    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "statistics":
        return <Statistics />;
      default:
        return (
          <>
            <HomeHeader userName="Milton" isOnline={true} />
            <HomeCarousel
              batteryLevel={batteryLevel}
              chargingMode={chargingMode}
              onModeChange={setChargingMode}
              onBatteryLevelChange={handleBatteryLevelChange}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col pt-10">
      {/* Main Card Container */}
      <div className="flex-1 flex flex-col px-5 pt-2 pb-36 safe-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative isolate flex-1 glass-strong glass-strong-no-top-stroke rounded-[2.5rem] flex flex-col overflow-hidden"
        >
          {activeTab === "home" && chargingMode !== "idle" && (
            <HomeBatteryWater batteryLevel={batteryLevel} mode={chargingMode} />
          )}
          {renderContent()}
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <AppBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
