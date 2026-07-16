import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { getHomeTexts } from "@/lib/home-i18n";

interface SpotPriceCardProps {
  currentPrice: number;
  trend: "up" | "down" | "stable";
  nextHourPrice: number;
  optimalTime?: string;
}

export function SpotPriceCard({ currentPrice, trend, nextHourPrice, optimalTime }: SpotPriceCardProps) {
  const { language } = useLanguage();
  const home = getHomeTexts(language);
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-destructive" : trend === "down" ? "text-success" : "text-muted-foreground";
  
  // Price level indicator
  const priceLevel = currentPrice < 0.5 ? "low" : currentPrice < 1.5 ? "medium" : "high";
  const priceLevelConfig = {
    low: { label: home.spotPrice.priceLow, color: "text-success", bg: "bg-success/20" },
    medium: { label: home.spotPrice.priceMedium, color: "text-warning", bg: "bg-warning/20" },
    high: { label: home.spotPrice.priceHigh, color: "text-destructive", bg: "bg-destructive/20" },
  };

  const trendLabel =
    trend === "up" ? home.spotPrice.trendUp : trend === "down" ? home.spotPrice.trendDown : home.spotPrice.trendStable;

  return (
    <GlassCard>
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-sm font-medium text-muted-foreground">{home.spotPrice.title}</h3>
        <span className={cn(
          "px-2 py-1 rounded-full text-xs font-medium",
          priceLevelConfig[priceLevel].bg,
          priceLevelConfig[priceLevel].color
        )}>
          {priceLevelConfig[priceLevel].label}
        </span>
      </div>

      <div className="flex items-baseline gap-2 mb-4">
        <span className="text-4xl font-semibold">{currentPrice.toFixed(2)}</span>
        <span className="text-muted-foreground">{home.unit.sekPerKwh}</span>
        <div className={cn("flex items-center gap-1 ml-2", trendColor)}>
          <TrendIcon className="w-4 h-4" />
          <span className="text-sm">
            {trendLabel}
          </span>
        </div>
      </div>

      {/* Mini price chart visualization */}
      <div className="h-16 flex items-end gap-1 mb-4">
        {[0.8, 1.2, 0.9, 0.6, 0.4, 0.5, currentPrice, nextHourPrice].map((price, i) => (
          <motion.div
            key={i}
            className={cn(
              "flex-1 rounded-t",
              i === 6 ? "bg-primary" : i === 7 ? "bg-primary/50" : "bg-glass-highlight"
            )}
            initial={{ height: 0 }}
            animate={{ height: `${(price / 2) * 100}%` }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
          />
        ))}
      </div>

      <div className="flex justify-between text-sm">
        <div>
          <span className="text-muted-foreground">{home.spotPrice.nextHour}</span>
          <span className={cn(
            nextHourPrice > currentPrice ? "text-destructive" : "text-success"
          )}>
            {nextHourPrice.toFixed(2)} {home.scheduleCard.currency}
          </span>
        </div>
        {optimalTime && (
          <div>
            <span className="text-muted-foreground">{home.spotPrice.bestTime}</span>
            <span className="text-success">{optimalTime}</span>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
