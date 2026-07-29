import { useCallback, useContext, useEffect, useState, type Dispatch, type SetStateAction } from "react";
import type { DayKey } from "@/components/schedule/DaySelector";
import { useAuth } from "@/hooks/useAuth";
import { SiteDataContext } from "@/hooks/site-data-context";
import {
  fetchChargingSchedules,
  NumizAuthError,
  NumizForbiddenError,
  updateChargingSchedules,
} from "@/lib/numiz-api";
import {
  FALLBACK_UI_CHARGING_SCHEDULE,
  mapChargingSchedulesToUi,
  mapUiScheduleToApi,
} from "@/lib/numiz-mappers";

export interface UseChargingScheduleResult {
  selectedDays: DayKey[];
  setSelectedDays: Dispatch<SetStateAction<DayKey[]>>;
  timeRange: { start: string; end: string };
  setTimeRange: Dispatch<SetStateAction<{ start: string; end: string }>>;
  loading: boolean;
  saving: boolean;
  fromApi: boolean;
  canSave: boolean;
  toggleDay: (day: DayKey) => void;
  save: () => Promise<boolean>;
}

export function useChargingSchedule(isOpen: boolean): UseChargingScheduleResult {
  const { isAuthenticated } = useAuth();
  const siteCtx = useContext(SiteDataContext);
  const vehicleId = siteCtx?.vehicle?.id ?? null;
  const hasSiteApi = siteCtx?.hasApiData ?? false;

  const [selectedDays, setSelectedDays] = useState<DayKey[]>(
    FALLBACK_UI_CHARGING_SCHEDULE.days,
  );
  const [timeRange, setTimeRange] = useState(FALLBACK_UI_CHARGING_SCHEDULE.timeRange);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [fromApi, setFromApi] = useState(false);

  const applyUi = useCallback((useFallbackWhenEmpty: boolean) => {
    return (schedules: Awaited<ReturnType<typeof fetchChargingSchedules>>) => {
      const ui = mapChargingSchedulesToUi(schedules, useFallbackWhenEmpty);
      setSelectedDays(ui.days);
      setTimeRange(ui.timeRange);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    if (!isAuthenticated || !vehicleId || !hasSiteApi) {
      const fallback = mapChargingSchedulesToUi([], true);
      setSelectedDays(fallback.days);
      setTimeRange(fallback.timeRange);
      setFromApi(false);
      setLoading(false);
      return;
    }

    let cancelled = false;

    async function load() {
      setLoading(true);
      try {
        const schedules = await fetchChargingSchedules(vehicleId);
        if (cancelled) return;
        applyUi(false)(schedules);
        setFromApi(true);
      } catch (err) {
        if (cancelled) return;
        applyUi(true)([]);
        setFromApi(false);
        if (!(err instanceof NumizAuthError) && !(err instanceof NumizForbiddenError)) {
          console.error("Failed to load charging schedule", err);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void load();

    return () => {
      cancelled = true;
    };
  }, [isOpen, isAuthenticated, vehicleId, hasSiteApi, applyUi]);

  const toggleDay = useCallback((day: DayKey) => {
    setSelectedDays((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day],
    );
  }, []);

  const save = useCallback(async (): Promise<boolean> => {
    if (!vehicleId || !hasSiteApi || selectedDays.length === 0) {
      return false;
    }

    setSaving(true);
    try {
      const body = mapUiScheduleToApi(selectedDays, timeRange);
      const updated = await updateChargingSchedules(vehicleId, body);
      applyUi(false)(updated);
      setFromApi(true);
      return true;
    } catch (err) {
      setFromApi(false);
      console.error("Failed to save charging schedule", err);
      return false;
    } finally {
      setSaving(false);
    }
  }, [vehicleId, hasSiteApi, selectedDays, timeRange, applyUi]);

  const canSave =
    Boolean(vehicleId && hasSiteApi && isAuthenticated) &&
    selectedDays.length > 0 &&
    !loading &&
    !saving;

  return {
    selectedDays,
    setSelectedDays,
    timeRange,
    setTimeRange,
    loading,
    saving,
    fromApi,
    canSave,
    toggleDay,
    save,
  };
}
