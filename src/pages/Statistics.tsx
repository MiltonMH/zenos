import { useState } from "react";
import { motion } from "framer-motion";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import { Zap, TrendingUp, TrendingDown, Battery, Plug } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { 
  weeklyData, 
  monthlyData, 
  yearlyData, 
  dailyData, 
  chargingHistory,
  getStatsForPeriod,
  type Period 
} from "@/lib/statistics-data";

export default function Statistics() {
  const [period, setPeriod] = useState<Period>("V");

  const getChartData = () => {
    switch (period) {
      case "D": return dailyData;
      case "V": return weeklyData;
      case "M": return monthlyData;
      case "Å": return yearlyData;
    }
  };

  const getXKey = () => {
    switch (period) {
      case "D": return "hour";
      case "V": return "day";
      case "M": return "week";
      case "Å": return "month";
    }
  };

  const data = getChartData();
  const xKey = getXKey();

  const stats = getStatsForPeriod(period);
  const avgPrice = stats.cost / stats.charged;

  const getPeriodLabel = () => {
    switch (period) {
      case "D": return "Idag";
      case "V": return "Denna vecka";
      case "M": return "Denna månad";
      case "Å": return "Detta år";
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-6 pb-2">
        <h1 className="text-xl font-semibold text-foreground text-center">Statistik</h1>
      </div>

      {/* Period Toggle */}
      <div className="flex justify-center px-4 mb-4">
        <div className="pill-toggle">
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
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide px-3 pb-4 space-y-3">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 gap-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <GlassCard className="p-3" variant="subtle">
              <div className="flex items-center gap-2 mb-1">
                <Zap className="w-4 h-4 text-primary" />
                <span className="text-xs text-muted-foreground">Laddat</span>
              </div>
              <div className="text-xl font-bold text-foreground">{stats.charged} kWh</div>
            </GlassCard>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <GlassCard className="p-3" variant="subtle">
              <div className="flex items-center gap-2 mb-1">
                <Battery className="w-4 h-4 text-success" />
                <span className="text-xs text-muted-foreground">V2H</span>
              </div>
              <div className="text-xl font-bold text-foreground">{stats.v2h} kWh</div>
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
                <span className="text-xs text-muted-foreground">Kostnad</span>
              </div>
              <div className="text-xl font-bold text-foreground">{stats.cost} kr</div>
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
                <span className="text-xs text-muted-foreground">Snittpris</span>
              </div>
              <div className="text-xl font-bold text-foreground">{avgPrice.toFixed(2)} kr/kWh</div>
            </GlassCard>
          </motion.div>
        </div>

        {/* Energy Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <GlassCard className="p-4" variant="subtle">
            <h3 className="text-sm font-medium text-foreground mb-3">Energiförbrukning</h3>
            <div className="h-[140px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
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
                    dataKey={xKey} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    unit=" kWh"
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
                <span className="text-xs text-muted-foreground">Laddat</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-success" />
                <span className="text-xs text-muted-foreground">V2H</span>
              </div>
            </div>
          </GlassCard>
        </motion.div>

        {/* Cost Chart */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
        >
          <GlassCard className="p-4" variant="subtle">
            <h3 className="text-sm font-medium text-foreground mb-3">Kostnad per {period === "V" ? "dag" : "vecka"}</h3>
            <div className="h-[100px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
                  <XAxis 
                    dataKey={xKey} 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                    unit=" kr"
                  />
                  <Bar dataKey="cost" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.cost > 60 ? 'hsl(var(--destructive))' : 'hsl(var(--primary))'} 
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </GlassCard>
        </motion.div>

        {/* Charging History */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <GlassCard className="p-4" variant="subtle">
            <h3 className="text-sm font-medium text-foreground mb-3">Laddningshistorik</h3>
            <div className="space-y-2">
              {chargingHistory.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + index * 0.05 }}
                  className="flex items-center gap-3 p-2.5 rounded-xl bg-white/30"
                >
                  <div className={`p-2 rounded-lg ${
                    session.type === "charging" ? "bg-primary/10" : "bg-success/10"
                  }`}>
                    {session.type === "charging" ? (
                      <Plug className={`w-4 h-4 ${session.type === "charging" ? "text-primary" : "text-success"}`} />
                    ) : (
                      <Battery className="w-4 h-4 text-success" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-foreground">{session.date}</span>
                      <span className="text-[10px] text-muted-foreground">{session.time}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs text-muted-foreground">
                        {session.energy} kWh
                      </span>
                      <span className="text-[10px] text-muted-foreground/60">•</span>
                      <span className="text-xs text-muted-foreground">
                        {session.priceAvg.toFixed(2)} kr/kWh
                      </span>
                    </div>
                  </div>

                  <div className="text-right">
                    {session.type === "charging" ? (
                      <span className="text-sm font-semibold text-foreground">
                        {session.cost.toFixed(0)} kr
                      </span>
                    ) : (
                      <span className="text-xs font-medium text-success">
                        Sparat
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
}
