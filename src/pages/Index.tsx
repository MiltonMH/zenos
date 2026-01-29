import { useState } from "react";
import { motion } from "framer-motion";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { AppBottomNav } from "@/components/layout/AppBottomNav";
import { HomeCarousel } from "@/components/home/HomeCarousel";
import { ChargingScheduleModal } from "@/components/schedule/ChargingScheduleModal";
import Profile from "./Profile";
import Statistics from "./Statistics";
import Settings from "./Settings";
import { mockUser } from "@/lib/mock-data";

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [showSettings, setShowSettings] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [chargingMode, setChargingMode] = useState<"idle" | "charging" | "v2h" | "v2g">("idle");

  const renderContent = () => {
    if (showSettings) {
      return <Settings onBack={() => setShowSettings(false)} />;
    }

    switch (activeTab) {
      case "profile":
        return <Profile />;
      case "statistics":
        return <Statistics />;
      default:
        return (
          <>
            <HomeHeader 
              userName={mockUser.firstName} 
              isOnline={true} 
              onSettingsClick={() => setShowSettings(true)} 
            />
            <HomeCarousel 
              chargingMode={chargingMode} 
              onModeChange={setChargingMode}
              onScheduleClick={() => setShowSchedule(true)}
            />
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col">
      {/* Main Card Container */}
      <div className="flex-1 flex flex-col px-5 pt-2 pb-36 safe-top">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 glass-strong rounded-[2.5rem] flex flex-col overflow-hidden border-2 border-white/60"
        >
          {renderContent()}
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
