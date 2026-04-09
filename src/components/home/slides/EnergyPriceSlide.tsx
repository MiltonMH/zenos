import { useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";

type Tab = "today" | "tomorrow";

// More realistic hourly price data
const todayPrices = [
  { hour: 0, price: 0.32 },
  { hour: 1, price: 0.28 },
  { hour: 2, price: 0.25 },
  { hour: 3, price: 0.22 },
  { hour: 4, price: 0.20 },
  { hour: 5, price: 0.24 },
  { hour: 6, price: 0.45 },
  { hour: 7, price: 0.68 },
  { hour: 8, price: 0.82 },
  { hour: 9, price: 0.75 },
  { hour: 10, price: 0.62 },
  { hour: 11, price: 0.55 },
  { hour: 12, price: 0.58 },
  { hour: 13, price: 0.52 },
  { hour: 14, price: 0.48 },
  { hour: 15, price: 0.55 },
  { hour: 16, price: 0.72 },
  { hour: 17, price: 0.95 },
  { hour: 18, price: 0.88 },
  { hour: 19, price: 0.65 },
  { hour: 20, price: 0.52 },
  { hour: 21, price: 0.45 },
  { hour: 22, price: 0.38 },
  { hour: 23, price: 0.32 },
];

export function EnergyPriceSlide() {
  const [tab, setTab] = useState<Tab>("today");

  const priceData = todayPrices;
  const currentHour = 18;
  const currentPrice = priceData.find(p => p.hour === currentHour)?.price || 0;

  // Calculate min/max
  const minPrice = Math.min(...priceData.map(p => p.price));
  const maxPrice = Math.max(...priceData.map(p => p.price));
  const minHour = priceData.find(p => p.price === minPrice)?.hour || 0;
  const maxHour = priceData.find(p => p.price === maxPrice)?.hour || 0;

  // Chart dimensions
  const chartWidth = 260;
  const chartHeight = 100;

  // Create smooth path through all points
  const points = priceData.map((d) => ({
    x: (d.hour / 23) * chartWidth,
    y: chartHeight - ((d.price - minPrice) / (maxPrice - minPrice)) * chartHeight * 0.9 - chartHeight * 0.05,
  }));

  // Smooth curve path
  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  // Current price position
  const currentPoint = points.find((_, i) => priceData[i].hour === currentHour);
  const currentX = currentPoint?.x || 0;
  const currentY = currentPoint?.y || 0;

  const formatHour = (hour: number) => `${hour.toString().padStart(2, '0')}:00`;

  return (
    <div className="h-full flex flex-col items-center px-4 pt-0 pb-3 max-h-sm:pb-2 overflow-y-auto">
      {/* Title */}
      <h2 className="text-lg font-semibold text-foreground mb-2 mt-1">Elpris idag</h2>

      {/* Tab Toggle */}
      <div className="pill-toggle mb-3">
        <button
          onClick={() => setTab("today")}
          className={`pill-toggle-item relative ${tab === "today" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {tab === "today" && (
            <motion.span
              layoutId="energy-price-tab-indicator"
              className="absolute inset-0 rounded-full bg-primary/20 border border-primary/35 shadow-sm"
              transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}
            />
          )}
          <span className="relative z-10">idag</span>
        </button>
        <button
          onClick={() => setTab("tomorrow")}
          className={`pill-toggle-item relative ${tab === "tomorrow" ? "text-foreground" : "text-muted-foreground hover:text-foreground"}`}
        >
          {tab === "tomorrow" && (
            <motion.span
              layoutId="energy-price-tab-indicator"
              className="absolute inset-0 rounded-full bg-primary/20 border border-primary/35 shadow-sm"
              transition={{ type: "spring", stiffness: 380, damping: 34, mass: 0.8 }}
            />
          )}
          <span className="relative z-10">imorgon</span>
        </button>
      </div>

      {/* Price Summary Cards */}
      <div className="flex gap-2 w-full max-w-[280px] mb-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 glass-subtle rounded-xl p-3"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingDown className="w-3.5 h-3.5 text-success" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Lägst</span>
          </div>
          <div className="text-lg font-bold text-success">{minPrice.toFixed(2)} kr</div>
          <div className="text-xs text-muted-foreground">kl {formatHour(minHour)}</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex-1 glass-subtle rounded-xl p-3"
        >
          <div className="flex items-center gap-1.5 mb-1">
            <TrendingUp className="w-3.5 h-3.5 text-destructive" />
            <span className="text-[10px] text-muted-foreground uppercase tracking-wide">Högst</span>
          </div>
          <div className="text-lg font-bold text-destructive">{maxPrice.toFixed(2)} kr</div>
          <div className="text-xs text-muted-foreground">kl {formatHour(maxHour)}</div>
        </motion.div>
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="relative glass-subtle rounded-2xl p-4 w-full max-w-[300px]">
          {/* Current price label */}
          <div className="absolute top-3 right-4 text-right">
            <div className="text-[10px] text-muted-foreground">Just nu</div>
            <div className="text-base font-bold text-primary">{currentPrice.toFixed(2)} kr/kWh</div>
          </div>

          {/* Chart area */}
          <div className="mt-8">
            <svg width={chartWidth} height={chartHeight + 25} className="overflow-visible">
              {/* Gradient fill */}
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </linearGradient>
              </defs>

              {/* Area fill */}
              <path
                d={`${pathD} L ${chartWidth} ${chartHeight} L 0 ${chartHeight} Z`}
                fill="url(#priceGradient)"
              />

              {/* Line */}
              <motion.path
                d={pathD}
                fill="none"
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />

              {/* Min point */}
              <circle
                cx={points[minHour]?.x}
                cy={points[minHour]?.y}
                r="4"
                fill="hsl(var(--success))"
                stroke="white"
                strokeWidth="2"
              />

              {/* Max point */}
              <circle
                cx={points[maxHour]?.x}
                cy={points[maxHour]?.y}
                r="4"
                fill="hsl(var(--destructive))"
                stroke="white"
                strokeWidth="2"
              />

              {/* Current price dot */}
              <motion.circle
                cx={currentX}
                cy={currentY}
                r="6"
                fill="hsl(var(--primary))"
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              />
            </svg>

            {/* X-axis labels */}
            <div className="flex justify-between mt-1 text-[10px] text-muted-foreground">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
              <span>24:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
