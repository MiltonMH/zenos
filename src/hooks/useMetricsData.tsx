import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { SiteDataContext } from "@/hooks/site-data-context";
import {
  fetchChargingHistory,
  fetchMetrics,
  fetchPrices,
} from "@/lib/numiz-api";
import {
  buildPriceDayRange,
  mapChargingHistoryToUi,
  mapMetricsBreakdownToChart,
  mapUiPeriodToMetricsPeriod,
  statsFromMetricsSummary,
  type ChartRow,
  type ChargingHistoryUiRow,
} from "@/lib/numiz-mappers";
import type { MetricsSummary, PricePoint } from "@/lib/numiz-types";
import {
  chargingHistory as mockChargingHistory,
  dailyData,
  getStatsForPeriod,
  monthlyData,
  weeklyData,
  yearlyData,
  type Period,
} from "@/lib/statistics-data";
import { getStatisticsTexts, type StatisticsTexts } from "@/lib/statistics-i18n";
import { getStoredLanguage } from "@/lib/i18n";

export interface MetricsFromApi {
  stats: boolean;
  history: boolean;
  prices: boolean;
}

export interface MetricsDataContextValue {
  period: Period;
  setPeriod: (period: Period) => void;
  stats: { charged: number; v2h: number; cost: number };
  chartData: ChartRow[];
  chartXKey: string;
  history: ChargingHistoryUiRow[];
  /** GET /prices for today — canonical PricePoint[] from the API. */
  pricesToday: PricePoint[];
  /** GET /prices for tomorrow — empty when the API has no forward quotes. */
  pricesTomorrow: PricePoint[];
  loading: boolean;
  fromApi: MetricsFromApi;
  refetch: () => void;
}

const MetricsDataContext = createContext<MetricsDataContextValue | null>(null);

function getMockChartData(period: Period, texts: StatisticsTexts): ChartRow[] {
  switch (period) {
    case "D":
      return dailyData.map((row) => ({ ...row }));
    case "W":
      return weeklyData.map((row) => {
        const dayLabelBySv: Record<string, keyof StatisticsTexts["days"]> = {
          Mån: "mon",
          Tis: "tue",
          Ons: "wed",
          Tor: "thu",
          Fre: "fri",
          Lör: "sat",
          Sön: "sun",
        };
        const key = dayLabelBySv[row.day];
        return { ...row, day: key ? texts.days[key] : row.day };
      });
    case "M":
      return monthlyData.map((row) => ({ ...row }));
    case "Y":
      return yearlyData.map((row) => ({ ...row }));
  }
}

function getChartXKey(period: Period): string {
  switch (period) {
    case "D":
      return "hour";
    case "W":
      return "day";
    case "M":
      return "week";
    case "Y":
      return "month";
  }
}

function historyRange(): { start: string; end: string } {
  const end = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 30);
  const format = (d: Date) => {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
  };
  return { start: format(start), end: format(end) };
}

export function MetricsDataProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated } = useAuth();
  const siteCtx = useContext(SiteDataContext);
  const site = siteCtx?.site ?? null;
  const hasApiData = siteCtx?.hasApiData ?? false;
  const [period, setPeriod] = useState<Period>("W");
  const [metrics, setMetrics] = useState<MetricsSummary | null>(null);
  const [history, setHistory] = useState<ChargingHistoryUiRow[]>([]);
  const [pricesToday, setPricesToday] = useState<PricePoint[]>([]);
  const [pricesTomorrow, setPricesTomorrow] = useState<PricePoint[]>([]);
  const [loading, setLoading] = useState(false);
  const [fromApi, setFromApi] = useState<MetricsFromApi>({
    stats: false,
    history: false,
    prices: false,
  });
  const [fetchKey, setFetchKey] = useState(0);

  const refetch = useCallback(() => setFetchKey((k) => k + 1), []);

  const language = getStoredLanguage();
  const texts = getStatisticsTexts(language);
  const locale = language === "sv" ? "sv-SE" : "en-US";

  useEffect(() => {
    if (!isAuthenticated || !site || !hasApiData) {
      setMetrics(null);
      setHistory([]);
      setPricesToday([]);
      setPricesTomorrow([]);
      setFromApi({ stats: false, history: false, prices: false });
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      const currency = site.currency ?? "SEK";
      const metricsPeriod = mapUiPeriodToMetricsPeriod(period);
      const { start, end } = historyRange();
      const todayRange = buildPriceDayRange("today");
      const tomorrowRange = buildPriceDayRange("tomorrow");

      let statsOk = false;
      let historyOk = false;
      let pricesOk = false;

      try {
        const [metricsResult, historyResult, todayPrices, tomorrowPrices] =
          await Promise.all([
            fetchMetrics(site.id, currency, metricsPeriod),
            fetchChargingHistory(site.id, start, end),
            fetchPrices(todayRange.from, todayRange.to, site.id),
            fetchPrices(tomorrowRange.from, tomorrowRange.to, site.id),
          ]);

        if (cancelled) return;

        const hasMetrics = metricsResult.summary.eventCount > 0;
        setMetrics(hasMetrics ? metricsResult : null);
        statsOk = hasMetrics;

        const mappedHistory = mapChargingHistoryToUi(historyResult, locale);
        setHistory(
          mappedHistory.length > 0
            ? mappedHistory
            : mockChargingHistory.map((row) => ({
                ...row,
                id: String(row.id),
              })),
        );
        historyOk = historyResult.length > 0;

        // console.log("todayPrices",  todayPrices);
        setPricesToday(todayPrices);
        setPricesTomorrow(tomorrowPrices);
        pricesOk = todayPrices.length > 0;
      } catch {
        if (cancelled) return;
        setMetrics(null);
        setHistory(
          mockChargingHistory.map((row) => ({ ...row, id: String(row.id) })),
        );
        setPricesToday([]);
        setPricesTomorrow([]);
      } finally {
        if (!cancelled) {
          setFromApi({ stats: statsOk, history: historyOk, prices: pricesOk });
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [isAuthenticated, site, hasApiData, period, fetchKey, locale]);

  const mockStats = getStatsForPeriod(period);
  const apiStats = statsFromMetricsSummary(metrics);
  const stats = apiStats ?? mockStats;

  const chartData = useMemo(() => {
    if (metrics?.breakdown.length) {
      return mapMetricsBreakdownToChart(
        metrics.breakdown,
        period,
        texts.days,
        undefined,
      );
    }
    return getMockChartData(period, texts);
  }, [metrics, period, texts]);

  const value = useMemo<MetricsDataContextValue>(
    () => ({
      period,
      setPeriod,
      stats,
      chartData,
      chartXKey: getChartXKey(period),
      history,
      pricesToday,
      pricesTomorrow,
      loading,
      fromApi,
      refetch,
    }),
    [
      period,
      stats,
      chartData,
      history,
      pricesToday,
      pricesTomorrow,
      loading,
      fromApi,
      refetch,
    ],
  );

  return (
    <MetricsDataContext.Provider value={value}>{children}</MetricsDataContext.Provider>
  );
}

export function useMetricsData(): MetricsDataContextValue {
  const ctx = useContext(MetricsDataContext);
  if (!ctx) {
    throw new Error("useMetricsData must be used within MetricsDataProvider");
  }
  return ctx;
}
