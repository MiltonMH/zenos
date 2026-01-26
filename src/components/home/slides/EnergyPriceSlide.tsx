import { useState } from "react";
import { motion } from "framer-motion";

type Tab = "today" | "tomorrow";

export function EnergyPriceSlide() {
  const [tab, setTab] = useState<Tab>("today");

  // Mock price data for 24 hours
  const priceData = [
    { hour: 0, price: 0.45 },
    { hour: 6, price: 0.65 },
    { hour: 12, price: 0.80 },
    { hour: 18, price: 0.40 },
    { hour: 24, price: 0.35 },
  ];

  const currentPrice = 0.40;
  const currentHour = 18;

  // SVG path for the line chart
  const chartWidth = 240;
  const chartHeight = 120;
  const maxPrice = 1.0;
  
  const points = priceData.map((d, i) => ({
    x: (d.hour / 24) * chartWidth,
    y: chartHeight - (d.price / maxPrice) * chartHeight,
  }));

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cpX = (prev.x + point.x) / 2;
    return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  // Current price position
  const currentX = (currentHour / 24) * chartWidth;
  const currentY = chartHeight - (currentPrice / maxPrice) * chartHeight;

  return (
    <div className="h-full flex flex-col items-center px-6 pt-4">
      {/* Title */}
      <h2 className="text-xl font-semibold text-foreground mb-4">Energy Price Now</h2>

      {/* Tab Toggle */}
      <div className="pill-toggle mb-6">
        <button
          onClick={() => setTab("today")}
          className={`pill-toggle-item ${tab === "today" ? "active" : ""}`}
        >
          today
        </button>
        <button
          onClick={() => setTab("tomorrow")}
          className={`pill-toggle-item ${tab === "tomorrow" ? "active" : ""}`}
        >
          tomorrow
        </button>
      </div>

      {/* Chart */}
      <div className="flex-1 flex items-center justify-center w-full">
        <div className="relative glass-subtle rounded-2xl p-4 w-full max-w-[300px]">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-4 bottom-12 flex flex-col justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>0.8</span>
            <span>0.6</span>
            <span>0.4</span>
            <span>0.2</span>
            <span>0</span>
          </div>

          {/* Y-axis unit */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 -rotate-90 text-xs font-medium text-muted-foreground">
            KR
          </div>

          {/* Chart area */}
          <div className="ml-6 relative">
            {/* Unit label */}
            <div className="absolute top-0 right-0 text-xs text-muted-foreground">
              SEK / kWh
            </div>

            <svg width={chartWidth} height={chartHeight + 30} className="overflow-visible">
              {/* Gradient fill */}
              <defs>
                <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="hsl(173, 50%, 45%)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(173, 50%, 45%)" stopOpacity="0" />
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
                stroke="hsl(173, 50%, 45%)"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />

              {/* Current price dot */}
              <motion.circle
                cx={currentX}
                cy={currentY}
                r="5"
                fill="hsl(173, 50%, 45%)"
                stroke="white"
                strokeWidth="2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.8 }}
              />
            </svg>

            {/* Current price tooltip */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="absolute glass rounded-lg px-3 py-1.5 text-xs"
              style={{
                right: "10px",
                top: `${currentY - 40}px`,
              }}
            >
              <div className="font-medium text-foreground">Now</div>
              <div className="text-primary font-semibold">{currentPrice} SEK</div>
            </motion.div>

            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>00:00</span>
              <span>06:00</span>
              <span>12:00</span>
              <span>18:00</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
