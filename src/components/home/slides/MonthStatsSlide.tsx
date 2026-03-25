import { useState } from "react";
import { motion } from "framer-motion";
import { getStatsForPeriod, type Period } from "@/lib/statistics-data";

export function MonthStatsSlide() {
  const [period, setPeriod] = useState<Period>("M");

  const periodStats = getStatsForPeriod(period);

  const stats = {
    charged: { value: periodStats.charged, unit: "kWh", color: "bg-[hsl(235,60%,60%)]" },
    v2h: { value: periodStats.v2h, unit: "kWh", color: "bg-[hsl(145,55%,55%)]" },
    spent: { value: periodStats.cost, unit: "kr", color: "bg-[hsl(15,70%,70%)]" },
  };

  // Bar heights based on values (normalized)
  const maxValue = Math.max(stats.charged.value, stats.v2h.value * 2, stats.spent.value);
  const barHeights = {
    charged: (stats.charged.value / maxValue) * 100,
    v2h: (stats.v2h.value * 2 / maxValue) * 100, // Scale up V2H for visual
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
        {(["D", "V", "M", "Å"] as Period[]).map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`pill-toggle-item ${period === p ? "active" : ""}`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Bar Chart */}
      <div className="flex-1 flex items-end justify-center gap-6 pb-8 w-full max-w-[200px]">
        {Object.entries(barHeights).map(([key, height], index) => (
          <motion.div
            key={key}
            className={`w-10 rounded-full ${stats[key as keyof typeof stats].color}`}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          />
        ))}
      </div>

      {/* Stats Labels */}
      <div className="w-full max-w-[280px] space-y-2 mb-4">
        <StatRow
          color="bg-[hsl(235,60%,60%)]"
          label="Laddat"
          value={stats.charged.value}
          unit={stats.charged.unit}
        />
        <StatRow
          color="bg-[hsl(145,55%,55%)]"
          label="V2H"
          value={stats.v2h.value}
          unit={stats.v2h.unit}
        />
        <StatRow
          color="bg-[hsl(15,70%,70%)]"
          label="Kostnad"
          value={stats.spent.value}
          unit={stats.spent.unit}
        />
      </div>
    </div>
  );
}

interface StatRowProps {
  color: string;
  label: string;
  value: number;
  unit: string;
}

function StatRow({ color, label, value, unit }: StatRowProps) {
  return (
    <div className="flex items-center gap-3 glass-subtle rounded-full px-4 py-2">
      <div className={`w-3 h-3 rounded-full ${color}`} />
      <span className="flex-1 text-sm font-medium text-foreground">{label}</span>
      <span className="text-sm font-semibold text-foreground">
        {value} {unit}
      </span>
    </div>
  );
}
