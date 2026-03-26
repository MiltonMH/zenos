import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { AppBottomNav } from "@/components/layout/AppBottomNav";
import { HomeBatteryWater } from "@/components/home/HomeBatteryWater";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import Profile from "./Profile";
import Settings from "./Settings";
import Statistics from "./Statistics";

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

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [chargingMode, setChargingMode] = useState<"idle" | "charging" | "v2h" | "v2g">("idle");
  const [batteryLevel, setBatteryLevel] = useState(50);
  const [activeHomeSlide, setActiveHomeSlide] = useState<"charger" | "stats" | "price">("charger");

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
      case "settings":
        return <Settings onBack={() => setActiveTab("home")} />;
      default:
        return (
          <>
            <HomeHeader
              userName="Milton"
              isOnline={true}
              onSettingsClick={() => setActiveTab("settings")}
              centerContent={
                <SlideIndicators currentSlide={activeHomeSlide} onChange={setActiveHomeSlide} />
              }
            />
            <HomeCarousel
              userName="Milton"
              batteryLevel={batteryLevel}
              chargingMode={chargingMode}
              onModeChange={setChargingMode}
              onBatteryLevelChange={handleBatteryLevelChange}
              activeSlide={activeHomeSlide}
              onSlideChange={setActiveHomeSlide}
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
          className="relative isolate flex-1 glass-strong glass-strong-no-top-stroke rounded-[2.5rem] border-[1px] border-white flex flex-col overflow-hidden"
        >
          {activeTab === "home" && activeHomeSlide === "charger" && chargingMode === "charging" && (
            <HomeBatteryWater batteryLevel={batteryLevel} mode={chargingMode} />
          )}
          <div className="relative z-10 flex-1 flex flex-col">
            {renderContent()}
          </div>
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <AppBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
