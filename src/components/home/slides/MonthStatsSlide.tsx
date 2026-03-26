import { useState } from "react";
import { motion } from "framer-motion";
import { getStatsForPeriod, type Period } from "@/lib/statistics-data";

export function MonthStatsSlide() {
  const [period, setPeriod] = useState<Period>("M");
  const periods: Period[] = ["D", "V", "M", "Å"];

  const periodStats = getStatsForPeriod(period);

  const stats = {
    charged: { value: periodStats.charged, unit: "kWh", colorClass: "bg-chart-charged" },
    v2h: { value: periodStats.v2h, unit: "kWh", colorClass: "bg-chart-v2h" },
    spent: { value: periodStats.cost, unit: "kr", colorClass: "bg-chart-spent" },
  };

  // Bar heights based on values (normalized)
  const maxValue = Math.max(stats.charged.value, stats.v2h.value * 2, stats.spent.value);
  const barHeights = {
    charged: (stats.charged.value / maxValue) * 100,
    v2h: (stats.v2h.value * 2 / maxValue) * 100,
    spent: (stats.spent.value / maxValue) * 100,
  };

  const getPeriodLabel = () => {
    switch (period) {
      case "D": return "Idag";
      case "V": return "Denna vecka";
      case "M": return "Denna månad";
      case "Å": return "Detta år";
    }
  };

  return (
    <div className="h-full flex flex-col items-center px-6 pt-4">
      {/* Title */}
      <h2 className="text-xl font-semibold text-foreground mb-4">{getPeriodLabel()}</h2>

      {/* Period Toggle */}
      <div className="pill-toggle mb-8">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`pill-toggle-item relative ${period === p ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {period === p && (
              <motion.span
                layoutId="month-stats-period-indicator"
                className="absolute inset-0 rounded-full bg-white shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}
              />
            )}
            <span className="relative z-10">{p}</span>
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="flex-1 flex items-end justify-center gap-6 pb-8 w-full max-w-[200px]">
        {Object.entries(barHeights).map(([key, height], index) => (
          <motion.div
            key={key}
            className={`w-10 rounded-full ${stats[key as keyof typeof stats].colorClass}`}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Stats Labels */}
      <div className="w-full max-w-[280px] space-y-2 mb-4">
        <StatRow
          colorClass="bg-chart-charged"
          label="Laddat"
          value={stats.charged.value}
          unit={stats.charged.unit}
        />
        <StatRow
          colorClass="bg-chart-v2h"
          label="V2H"
          value={stats.v2h.value}
          unit={stats.v2h.unit}
        />
        <StatRow
          colorClass="bg-chart-spent"
          label="Kostnad"
          value={stats.spent.value}
          unit={stats.spent.unit}
        />
      </div>
    </div>
  );
}

interface StatRowProps {
  colorClass: string;
  label: string;
  value: number;
  unit: string;
}

function StatRow({ colorClass, label, value, unit }: StatRowProps) {
  return (
    <div className="flex items-center gap-3 glass-subtle rounded-full px-4 py-2">
      <div className={`w-3 h-3 rounded-full ${colorClass}`} />
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">
        {value} {unit}
      </span>
    </div>
  );
}
