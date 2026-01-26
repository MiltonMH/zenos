import { useState } from "react";
import { motion } from "framer-motion";
import { HomeHeader } from "@/components/layout/HomeHeader";
import { AppBottomNav } from "@/components/layout/AppBottomNav";
import { HomeCarousel } from "@/components/home/HomeCarousel";

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [chargingMode, setChargingMode] = useState<"idle" | "charging" | "v2h" | "v2g">("charging");

  return (
    <div className="min-h-screen bg-gradient-mesh flex flex-col">
      {/* Main Card Container */}
      <div className="flex-1 flex flex-col px-4 py-4 pb-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 glass-strong rounded-[2rem] flex flex-col overflow-hidden"
        >
          {/* Header */}
          <HomeHeader userName="Milton" isOnline={true} />

          {/* Carousel Content */}
          <HomeCarousel 
            chargingMode={chargingMode} 
            onModeChange={setChargingMode} 
          />
        </motion.div>
      </div>

      {/* Bottom Navigation */}
      <AppBottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
