import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { DataSourceField } from "@/components/ui/data-source-field";
import { useMetricsData } from "@/hooks/useMetricsData";
import type { Period } from "@/lib/statistics-data";
import { useLanguage } from "@/lib/i18n";
import { getHomeTexts } from "@/lib/home-i18n";

export function MonthStatsSlide() {
  const { language } = useLanguage();
  const home = getHomeTexts(language);
  const [period, setPeriod] = useState<Period>("M");
  const periods: Period[] = ["D", "W", "M", "Y"];

  const { stats, fromApi, setPeriod: setMetricsPeriod } = useMetricsData();

  useEffect(() => {
    setMetricsPeriod(period);
  }, [period, setMetricsPeriod]);

  const statRows = {
    charged: { value: Math.round(stats.charged), unit: home.unit.kWh, colorClass: "bg-chart-charged" },
    v2h: { value: Math.round(stats.v2h), unit: home.unit.kWh, colorClass: "bg-chart-v2h" },
    spent: { value: Math.round(stats.cost), unit: home.unit.kr, colorClass: "bg-chart-spent" },
  };

  const maxValue = Math.max(
    statRows.charged.value,
    statRows.v2h.value * 2,
    statRows.spent.value,
  );
  const barHeights = {
    charged: maxValue > 0 ? (statRows.charged.value / maxValue) * 100 : 0,
    v2h: maxValue > 0 ? (statRows.v2h.value * 2 / maxValue) * 100 : 0,
    spent: maxValue > 0 ? (statRows.spent.value / maxValue) * 100 : 0,
  };

  return (
    <div className="h-full flex flex-col items-center px-6 pt-3 pb-3 max-h-sm:pb-2">
      <h2 className="text-xl font-semibold text-foreground mb-3">{home.period[period]}</h2>

      <div className="pill-toggle mb-4">
        {periods.map((p) => (
          <button
            key={p}
            onClick={() => setPeriod(p)}
            className={`pill-toggle-item relative ${period === p ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
          >
            {period === p && (
              <motion.span
                layoutId="month-stats-period-indicator"
                className="absolute inset-0 rounded-full bg-primary/20 border border-primary/35 shadow-sm"
                transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}
              />
            )}
            <span className="relative z-10">{home.periodShort[p]}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 flex items-end justify-center gap-6 pb-8 w-full max-w-[200px]">
        {Object.entries(barHeights).map(([key, height], index) => (
          <motion.div
            key={key}
            className={`w-10 rounded-full ${statRows[key as keyof typeof statRows].colorClass}`}
            initial={{ height: 0 }}
            animate={{ height: `${height}%` }}
            transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
          />
        ))}
      </div>

      <DataSourceField fromApi={fromApi.stats} className="w-full max-w-[280px] space-y-2 mb-4">
        <StatRow
          colorClass="bg-chart-charged"
          label={home.stat.charged}
          value={statRows.charged.value}
          unit={statRows.charged.unit}
        />
        <StatRow
          colorClass="bg-chart-v2h"
          label={home.stat.v2h}
          value={statRows.v2h.value}
          unit={statRows.v2h.unit}
        />
        <StatRow
          colorClass="bg-chart-spent"
          label={home.stat.cost}
          value={statRows.spent.value}
          unit={statRows.spent.unit}
        />
      </DataSourceField>
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
