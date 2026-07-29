import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Clock } from "lucide-react";
import { DataSourceField } from "@/components/ui/data-source-field";
import {
  fillPricePointsDay,
  findCurrentPricePoint,
  formatPricePointClock,
  priceKwhOf,
  pricePointMinutesSinceMidnight,
} from "@/lib/numiz-mappers";
import { useMetricsData } from "@/hooks/useMetricsData";
import { formatMessage, useLanguage } from "@/lib/i18n";
import { getHomeTexts } from "@/lib/home-i18n";

type Tab = "today" | "tomorrow";

const MINUTES_PER_DAY = 24 * 60;
const DEFAULT_BOX_WIDTH = 260;
const MIN_BOX_WIDTH = 180;
const CHART_HEIGHT = 100;

export function EnergyPriceSlide() {
  const { language } = useLanguage();
  const home = getHomeTexts(language);
  const [tab, setTab] = useState<Tab>("today");
  const { pricesToday, pricesTomorrow, fromApi } = useMetricsData();

  const pricePoints = useMemo(() => {
    if (tab === "today") {
      const source = fromApi.prices ? pricesToday : [];
      return fillPricePointsDay(source, new Date());
    }

    if (!fromApi.prices || pricesTomorrow.length === 0) {
      return [];
    }

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return fillPricePointsDay(pricesTomorrow, tomorrow);
  }, [tab, fromApi.prices, pricesToday, pricesTomorrow]);

  const now = new Date();
  const currentPrice =
    tab === "today" ? findCurrentPricePoint(pricePoints, now) : undefined;
  const currentPriceKwh = currentPrice ? priceKwhOf(currentPrice) : 0;

  const { minIndex, maxIndex, minPoint, maxPoint } = useMemo(() => {
    if (pricePoints.length === 0) {
      return {
        minIndex: -1,
        maxIndex: -1,
        minPoint: null as (typeof pricePoints)[number] | null,
        maxPoint: null as (typeof pricePoints)[number] | null,
      };
    }

    let minIdx = 0;
    let maxIdx = 0;
    for (let i = 1; i < pricePoints.length; i += 1) {
      if (priceKwhOf(pricePoints[i]) < priceKwhOf(pricePoints[minIdx])) minIdx = i;
      if (priceKwhOf(pricePoints[i]) > priceKwhOf(pricePoints[maxIdx])) maxIdx = i;
    }

    return {
      minIndex: minIdx,
      maxIndex: maxIdx,
      minPoint: pricePoints[minIdx],
      maxPoint: pricePoints[maxIdx],
    };
  }, [pricePoints]);

  const minPrice = minPoint ? priceKwhOf(minPoint) : 0;
  const maxPrice = maxPoint ? priceKwhOf(maxPoint) : 0;

  const slideRef = useRef<HTMLDivElement>(null);
  const chartAreaRef = useRef<HTMLDivElement>(null);
  const [boxWidth, setBoxWidth] = useState(DEFAULT_BOX_WIDTH);
  const [chartWidth, setChartWidth] = useState(DEFAULT_BOX_WIDTH);

  useLayoutEffect(() => {
    const element = chartAreaRef.current;
    if (!element) return;

    const updateWidth = () => {
      const width = Math.floor(element.clientWidth);
      if (width > 0) setChartWidth(width);
    };

    updateWidth();
    const observer = new ResizeObserver(updateWidth);
    observer.observe(element);
    return () => observer.disconnect();
  }, [boxWidth, pricePoints.length, tab]);

  const clampBoxWidth = useCallback((width: number) => {
    const maxWidth = slideRef.current?.clientWidth ?? DEFAULT_BOX_WIDTH;
    return Math.round(Math.min(maxWidth, Math.max(MIN_BOX_WIDTH, width)));
  }, []);

  const handleResizePointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      e.preventDefault();
      e.stopPropagation();

      const startX = e.clientX;
      const startWidth = boxWidth;
      const handle = e.currentTarget;
      handle.setPointerCapture(e.pointerId);

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        setBoxWidth(clampBoxWidth(startWidth + (ev.clientX - startX)));
      };

      const onUp = (ev: PointerEvent) => {
        if (ev.pointerId !== e.pointerId) return;
        handle.releasePointerCapture(e.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    },
    [boxWidth, clampBoxWidth],
  );

  const priceRange = maxPrice - minPrice || 1;

  const points = useMemo(() => {
    return pricePoints.map((point) => {
      const minutes = pricePointMinutesSinceMidnight(point);
      const price = priceKwhOf(point);
      return {
        x: (minutes / MINUTES_PER_DAY) * chartWidth,
        y:
          CHART_HEIGHT -
          ((price - minPrice) / priceRange) * CHART_HEIGHT * 0.9 -
          CHART_HEIGHT * 0.05,
      };
    });
  }, [pricePoints, chartWidth, minPrice, priceRange]);

  const pathD = useMemo(() => {
    return points.reduce((acc, point, i) => {
      if (i === 0) return `M ${point.x} ${point.y}`;
      const prev = points[i - 1];
      const cpX = (prev.x + point.x) / 2;
      return `${acc} C ${cpX} ${prev.y}, ${cpX} ${point.y}, ${point.x} ${point.y}`;
    }, "");
  }, [points]);

  const currentPointIndex =
    tab === "today" && currentPrice
      ? pricePoints.findIndex((p) => p.time.getTime() === currentPrice.time.getTime())
      : -1;
  const currentPoint = currentPointIndex >= 0 ? points[currentPointIndex] : undefined;

  return (
    <div className="h-full flex flex-col items-center px-4 pt-0 pb-3 max-h-sm:pb-2 overflow-y-auto">
      <h2 className="text-lg font-semibold text-foreground mb-2 mt-1">{home.energyPrice.title}</h2>

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
          <span className="relative z-10">{home.energyPrice.tabToday}</span>
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
          <span className="relative z-10">{home.energyPrice.tabTomorrow}</span>
        </button>
      </div>

      <DataSourceField
        fromApi={fromApi.prices}
        className={`w-full mb-3 ${tab === "today" ? "max-w-[420px]" : "max-w-[280px]"}`}
      >
        <div className="flex gap-2">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-1 glass-subtle rounded-xl p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingDown className="w-3.5 h-3.5 text-success" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {home.energyPrice.lowest}
              </span>
            </div>
            <div className="text-lg font-bold text-success">
              {minPrice.toFixed(2)} {home.unit.kr}
            </div>
            <div className="text-xs text-muted-foreground">
              {minPoint
                ? formatMessage(home.energyPrice.atTime, {
                    time: formatPricePointClock(minPoint),
                  })
                : null}
            </div>
          </motion.div>

          {tab === "today" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="flex-1 glass-subtle rounded-xl p-3"
            >
              <div className="flex items-center gap-1.5 mb-1">
                <Clock className="w-3.5 h-3.5 text-primary" />
                <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                  {home.energyPrice.justNow}
                </span>
              </div>
              <div className="text-lg font-bold text-primary">
                {currentPriceKwh.toFixed(2)} {home.unit.kr}
              </div>
              <div className="text-xs text-muted-foreground">
                {currentPrice
                  ? formatMessage(home.energyPrice.atTime, {
                      time: formatPricePointClock(currentPrice),
                    })
                  : null}
              </div>
            </motion.div>
          )}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: tab === "today" ? 0.1 : 0.05 }}
            className="flex-1 glass-subtle rounded-xl p-3"
          >
            <div className="flex items-center gap-1.5 mb-1">
              <TrendingUp className="w-3.5 h-3.5 text-destructive" />
              <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                {home.energyPrice.highest}
              </span>
            </div>
            <div className="text-lg font-bold text-destructive">
              {maxPrice.toFixed(2)} {home.unit.kr}
            </div>
            <div className="text-xs text-muted-foreground">
              {maxPoint
                ? formatMessage(home.energyPrice.atTime, {
                    time: formatPricePointClock(maxPoint),
                  })
                : null}
            </div>
          </motion.div>
        </div>
      </DataSourceField>

      <div ref={slideRef} className="flex-1 flex items-center justify-center w-full">
        <div className="shrink-0" style={{ width: boxWidth }}>
          <DataSourceField fromApi={fromApi.prices} className="w-full">
          <div className="relative glass-subtle rounded-2xl p-4 w-full select-none">
            {pricePoints.length === 0 ? (
              <div className="mt-8 py-12 text-center text-sm text-muted-foreground">
                {tab === "tomorrow"
                  ? home.energyPrice.tabTomorrow
                  : home.energyPrice.title}
              </div>
            ) : (
              <div ref={chartAreaRef} className="w-full">
                <svg
                  width={chartWidth}
                  height={CHART_HEIGHT + 25}
                  className="block w-full overflow-visible"
                >
                  <defs>
                    <linearGradient id="priceGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    </linearGradient>
                  </defs>

                  <path
                    d={`${pathD} L ${chartWidth} ${CHART_HEIGHT} L 0 ${CHART_HEIGHT} Z`}
                    fill="url(#priceGradient)"
                  />

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

                  {minIndex >= 0 && (
                    <circle
                      cx={points[minIndex].x}
                      cy={points[minIndex].y}
                      r="4"
                      fill="hsl(var(--success))"
                      stroke="white"
                      strokeWidth="2"
                    />
                  )}

                  {maxIndex >= 0 && (
                    <circle
                      cx={points[maxIndex].x}
                      cy={points[maxIndex].y}
                      r="4"
                      fill="hsl(var(--destructive))"
                      stroke="white"
                      strokeWidth="2"
                    />
                  )}

                  {tab === "today" && currentPoint && (
                    <motion.circle
                      cx={currentPoint.x}
                      cy={currentPoint.y}
                      r="6"
                      fill="hsl(var(--primary))"
                      stroke="white"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.8 }}
                    />
                  )}
                </svg>

                <div className="flex justify-between mt-1 w-full text-[10px] text-muted-foreground">
                  <span>00:00</span>
                  <span>06:00</span>
                  <span>12:00</span>
                  <span>18:00</span>
                  <span>24:00</span>
                </div>
              </div>
            )}

            <div
              role="separator"
              aria-orientation="vertical"
              aria-label="Resize chart"
              onPointerDown={handleResizePointerDown}
              className="absolute inset-y-3 right-0 w-2 cursor-ew-resize touch-none rounded-r-2xl hover:bg-primary/10"
            />
          </div>
        </DataSourceField>
        </div>
      </div>
    </div>
  );
}
