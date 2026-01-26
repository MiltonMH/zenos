import { useState } from "react";
import { motion } from "framer-motion";
import { Zap, Battery, Home, TrendingUp, Calendar, Leaf } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { BottomNav } from "@/components/layout/BottomNav";
import { ChargerStatus } from "@/components/charger/ChargerStatus";
import { EnergyFlowCard } from "@/components/charger/EnergyFlowCard";
import { SpotPriceCard } from "@/components/charger/SpotPriceCard";
import { QuickActionButton } from "@/components/charger/QuickActionButton";
import { ChargingScheduleCard } from "@/components/charger/ChargingScheduleCard";
import { StatsCard } from "@/components/charger/StatsCard";
import { PremiumBanner } from "@/components/premium/PremiumBanner";

export default function Index() {
  const [activeTab, setActiveTab] = useState("home");
  const [chargingMode, setChargingMode] = useState<"idle" | "charging" | "v2h" | "v2g">("charging");

  // Mock data
  const mockSchedule = [
    { time: "02:00", action: "charge" as const, price: 0.32 },
    { time: "06:00", action: "v2h" as const, price: 1.45 },
    { time: "09:00", action: "idle" as const, price: 2.10 },
    { time: "14:00", action: "charge" as const, price: 0.85 },
  ];

  return (
    <div className="min-h-screen bg-background bg-gradient-mesh">
      {/* Header */}
      <Header
        userName="Erik"
        chargerName="ZenBox Pro"
        isOnline={true}
        hasNotifications={true}
      />

      {/* Main content */}
      <main className="px-4 pb-28 pt-4 space-y-6">
        {/* Charger Status - Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="py-6"
        >
          <ChargerStatus
            mode={chargingMode}
            power={7.4}
            batteryLevel={67}
            isConnected={true}
          />
        </motion.section>

        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Snabbåtgärder</h2>
          <div className="grid grid-cols-4 gap-3">
            <QuickActionButton
              icon={Zap}
              label="Ladda"
              variant="primary"
              isActive={chargingMode === "charging"}
              onClick={() => setChargingMode("charging")}
            />
            <QuickActionButton
              icon={Home}
              label="V2H"
              sublabel="Premium"
              variant="premium"
              isPremium
              isActive={chargingMode === "v2h"}
              onClick={() => setChargingMode("v2h")}
            />
            <QuickActionButton
              icon={TrendingUp}
              label="V2G"
              sublabel="Premium"
              variant="premium"
              isPremium
              isActive={chargingMode === "v2g"}
              onClick={() => setChargingMode("v2g")}
            />
            <QuickActionButton
              icon={Calendar}
              label="Schema"
              variant="secondary"
              onClick={() => setActiveTab("schedule")}
            />
          </div>
        </motion.section>

        {/* Energy Flow */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <EnergyFlowCard
            direction={
              chargingMode === "charging" ? "grid-to-car" :
              chargingMode === "v2h" ? "car-to-home" :
              chargingMode === "v2g" ? "car-to-grid" : "idle"
            }
            power={7.4}
          />
        </motion.section>

        {/* Stats Grid */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-sm font-medium text-muted-foreground mb-3">Denna månad</h2>
          <div className="grid grid-cols-2 gap-3">
            <StatsCard
              icon={Battery}
              label="Total energi"
              value="342"
              unit="kWh"
              trend={{ value: 12, isPositive: true }}
              color="primary"
            />
            <StatsCard
              icon={Leaf}
              label="CO₂ sparat"
              value="156"
              unit="kg"
              trend={{ value: 8, isPositive: true }}
              color="success"
            />
          </div>
        </motion.section>

        {/* Spot Price */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <SpotPriceCard
            currentPrice={0.85}
            trend="down"
            nextHourPrice={0.62}
            optimalTime="02:00 - 05:00"
          />
        </motion.section>

        {/* Smart Schedule */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <ChargingScheduleCard
            isSmartScheduleActive={true}
            nextAction="Börja ladda"
            nextActionTime="02:00"
            schedule={mockSchedule}
            onToggleSmart={() => {}}
          />
        </motion.section>

        {/* Premium Banner */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <PremiumBanner
            daysLeft={45}
            onUpgrade={() => console.log("Upgrade clicked")}
          />
        </motion.section>
      </main>

      {/* Bottom Navigation */}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
}
