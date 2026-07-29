import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { TrendingUp, TrendingDown, Plug } from "lucide-react";
import lightningIcon from "@/assets/Lightning_Vector1.svg";
import batteryIcon from "@/assets/Battery_Colored.svg";
import { GlassCard } from "@/components/ui/glass-card";
import { DataSourceField } from "@/components/ui/data-source-field";
import { useMetricsData } from "@/hooks/useMetricsData";
import type { Period } from "@/lib/statistics-data";
import { useLanguage } from "@/lib/i18n";
import { getStatisticsTexts } from "@/lib/statistics-i18n";

export default function Statistics() {
  const { language } = useLanguage();
  const texts = getStatisticsTexts(language);
  const [period, setPeriod] = useState<Period>("W");
  const periods: Period[] = ["D", "W", "M", "Y"];

  const {
    stats,
    chartData,
    chartXKey,
    history,
    fromApi,
    setPeriod: setMetricsPeriod,
  } = useMetricsData();

  useEffect(() => {
    setMetricsPeriod(period);
  }, [period, setMetricsPeriod]);

  const localizeRelativeDate = (date: string) => {
    if (date === "Idag") return texts.relative.today;
    if (date === "Igår") return texts.relative.yesterday;
    return date;
  };

  const avgPrice = stats.charged > 0 ? stats.cost / stats.charged : 0;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-semibold text-foreground text-center">{texts.title}</h1>
      </div>

      <div className="flex justify-center px-4 mb-4">
        <div className="pill-toggle relative w-full max-w-[240px]">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`pill-toggle-item relative z-10 flex-1 ${period === p ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              {period === p && (
                <motion.span
                  layoutId="statistics-period-indicator"
                  className="absolute inset-0 rounded-full bg-primary/20 border border-primary/35 shadow-sm"
                  transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}
                />
              )}
              <span className="relative z-10">{texts.periodShort[p]}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-4 space-y-3">
        <DataSourceField fromApi={fromApi.stats} className="grid grid-cols-2 gap-2">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="p-3" variant="subtle">
              <div className="flex items-center gap-2 mb-1">
                <img src={lightningIcon} alt={texts.alt.charged} className="w-4 h-4" />
                <span className="text-xs text-muted-foreground">{texts.stat.charged}</span>
              </div>
              <div className="text-l font-medium text-foreground">
                {Math.round(stats.charged)} {texts.unit.kWh}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <GlassCard className="p-3" variant="subtle">
              <div className="flex items-center gap-2 mb-1">
                <img src={batteryIcon} alt={texts.alt.v2h} className="w-4 h-4" />
                <span className="text-xs text-muted-foreground">{texts.stat.v2h}</span>
              </div>
              <div className="text-l font-medium text-foreground">
                {Math.round(stats.v2h)} {texts.unit.kWh}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <GlassCard className="p-3" variant="subtle">
              <div className="flex items-center gap-2 mb-1">
                <TrendingDown className="w-4 h-4 text-destructive" />
                <span className="text-xs text-muted-foreground">{texts.stat.cost}</span>
              </div>
              <div className="text-l font-medium text-foreground">
                {Math.round(stats.cost)} {texts.unit.kr}
              </div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
          >
            <GlassCard className="p-3" variant="subtle">
              <div className="flex items-center gap-2 mb-1">
                <TrendingUp className="w-4 h-4 text-accent" />
                <span className="text-xs text-muted-foreground">{texts.stat.avgPrice}</span>
              </div>
              <div className="text-l font-medium text-foreground">
                {avgPrice.toFixed(2)} {texts.unit.krPerKwh}
              </div>
            </GlassCard>
          </motion.div>
        </DataSourceField>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <DataSourceField fromApi={fromApi.stats}>
            <GlassCard className="p-4" variant="subtle">
              <h3 className="text-sm font-medium text-foreground mb-3">{texts.chart.energyTitle}</h3>
              <div className="h-[140px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="chargedGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                      </linearGradient>
                      <linearGradient id="v2hGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--success))" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="hsl(var(--success))" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey={chartXKey}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      unit={` ${texts.unit.kWh}`}
                    />
                    <Area
                      type="monotone"
                      dataKey="charged"
                      stroke="hsl(var(--primary))"
                      strokeWidth={2}
                      fill="url(#chargedGradient)"
                    />
                    <Area
                      type="monotone"
                      dataKey="v2h"
                      stroke="hsl(var(--success))"
                      strokeWidth={2}
                      fill="url(#v2hGradient)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4 mt-2">
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-xs text-muted-foreground">{texts.stat.charged}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-success" />
                  <span className="text-xs text-muted-foreground">{texts.stat.v2h}</span>
                </div>
              </div>
            </GlassCard>
          </DataSourceField>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <DataSourceField fromApi={fromApi.stats}>
            <GlassCard className="p-4" variant="subtle">
              <h3 className="text-sm font-medium text-foreground mb-3">
                {period === "W" ? texts.chart.costPerDay : texts.chart.costPerWeek}
              </h3>
              <div className="h-[100px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                    <XAxis
                      dataKey={chartXKey}
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      unit={` ${texts.unit.kr}`}
                    />
                    <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.cost > 60 ? "hsl(var(--destructive))" : "hsl(var(--primary))"}
                          fillOpacity={0.8}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </GlassCard>
          </DataSourceField>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <DataSourceField fromApi={fromApi.history}>
            <GlassCard className="p-4" variant="subtle">
              <h3 className="text-sm font-medium text-foreground mb-3">{texts.history.title}</h3>
              <div className="space-y-2">
                {history.map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className="flex items-center gap-3 p-2.5 rounded-xl bg-white/30"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        session.type === "charging" ? "bg-primary/10" : "bg-success/10"
                      }`}
                    >
                      {session.type === "charging" ? (
                        <Plug className="w-4 h-4 text-primary" />
                      ) : (
                        <img src={batteryIcon} alt={texts.alt.v2h} className="w-4 h-4" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium text-foreground">
                          {localizeRelativeDate(session.date)}
                        </span>
                        <span className="text-[10px] text-muted-foreground">{session.time}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {session.energy.toFixed(1)} {texts.unit.kWh}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60">•</span>
                        <span className="text-xs text-muted-foreground">
                          {session.priceAvg.toFixed(2)} {texts.unit.krPerKwh}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      {session.type === "charging" ? (
                        <span className="text-sm font-semibold text-foreground">
                          {session.cost.toFixed(0)} {texts.unit.kr}
                        </span>
                      ) : (
                        <span className="text-xs font-medium text-success">{texts.saved}</span>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </GlassCard>
          </DataSourceField>
        </motion.div>
      </div>
    </div>
  );
}
