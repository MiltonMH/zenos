import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchChargingSettings,
  updateChargingSettings,
  NumizAuthError,
  NumizForbiddenError,
} from "@/lib/numiz-api";
import { mapChargingSettings } from "@/lib/numiz-mappers";
import type {
  ChargingSettings,
  UpdateChargingSettingsRequest,
} from "@/lib/numiz-types";

const SAVE_DEBOUNCE_MS = 500;

export interface UseChargingSettingsResult {
  settings: ChargingSettings | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
  fromApi: boolean;
  /** SoC / V2X enable blocked for unknown vehicle (socLimitSource=defaults). */
  socLocked: boolean;
  canWrite: boolean;
  patch: (partial: UpdateChargingSettingsRequest) => void;
  patchImmediate: (partial: UpdateChargingSettingsRequest) => Promise<void>;
}

/**
 * Loads and persists ZenOS Settings via GET/PUT /devices/{id}/charging-settings.
 * Local optimistic state + debounced PUT for sliders; immediate PUT for toggles/mode.
 */
export function useChargingSettings(
  deviceId: string | null | undefined,
  canWrite: boolean,
): UseChargingSettingsResult {
  const [settings, setSettings] = useState<ChargingSettings | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fromApi, setFromApi] = useState(false);

  const pendingRef = useRef<UpdateChargingSettingsRequest>({});
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestSeq = useRef(0);
  const settingsRef = useRef<ChargingSettings | null>(null);

  useEffect(() => {
    settingsRef.current = settings;
  }, [settings]);

  useEffect(() => {
    if (!deviceId) {
      setSettings(null);
      setFromApi(false);
      setLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    const seq = ++requestSeq.current;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const raw = await fetchChargingSettings(deviceId);
        if (cancelled || seq !== requestSeq.current) return;
        const mapped = mapChargingSettings(raw);
        setSettings(mapped);
        setFromApi(true);
      } catch (err) {
        if (cancelled || seq !== requestSeq.current) return;
        setFromApi(false);
        if (err instanceof NumizAuthError) {
          setError("UNAUTHORIZED");
        } else if (err instanceof NumizForbiddenError) {
          setError("FORBIDDEN");
        } else {
          setError(err instanceof Error ? err.message : "REQUEST_FAILED");
        }
      } finally {
        if (!cancelled && seq === requestSeq.current) {
          setLoading(false);
        }
      }
    }

    void load();

    return () => {
      cancelled = true;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [deviceId]);

  const flush = useCallback(async () => {
    const id = deviceId;
    if (!id || !canWrite) return;

    const body = { ...pendingRef.current };
    pendingRef.current = {};
    if (Object.keys(body).length === 0) return;

    const snapshot = settingsRef.current;
    setSaving(true);
    setError(null);
    try {
      const raw = await updateChargingSettings(id, body);
      const mapped = mapChargingSettings(raw);
      setSettings(mapped);
      setFromApi(true);
    } catch (err) {
      if (snapshot) setSettings(snapshot);
      if (err instanceof NumizForbiddenError) {
        setError("FORBIDDEN");
      } else {
        setError(err instanceof Error ? err.message : "REQUEST_FAILED");
      }
    } finally {
      setSaving(false);
    }
  }, [deviceId, canWrite]);

  const scheduleFlush = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      void flush();
    }, SAVE_DEBOUNCE_MS);
  }, [flush]);

  const applyOptimistic = useCallback((partial: UpdateChargingSettingsRequest) => {
    setSettings((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        ...(partial.maxChargeSocPercent !== undefined
          ? { maxChargeSocPercent: partial.maxChargeSocPercent }
          : {}),
        ...(partial.minDischargeSocPercent !== undefined
          ? { minDischargeSocPercent: partial.minDischargeSocPercent }
          : {}),
        ...(partial.v2hEnabled !== undefined ? { v2hEnabled: partial.v2hEnabled } : {}),
        ...(partial.v2gEnabled !== undefined ? { v2gEnabled: partial.v2gEnabled } : {}),
        ...(partial.optimizationMode !== undefined
          ? { optimizationMode: partial.optimizationMode }
          : {}),
      };
    });
  }, []);

  const patch = useCallback(
    (partial: UpdateChargingSettingsRequest) => {
      if (!canWrite || !deviceId) return;
      applyOptimistic(partial);
      pendingRef.current = { ...pendingRef.current, ...partial };
      scheduleFlush();
    },
    [applyOptimistic, canWrite, deviceId, scheduleFlush],
  );

  const patchImmediate = useCallback(
    async (partial: UpdateChargingSettingsRequest) => {
      if (!canWrite || !deviceId) return;
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      applyOptimistic(partial);
      pendingRef.current = { ...pendingRef.current, ...partial };
      await flush();
    },
    [applyOptimistic, canWrite, deviceId, flush],
  );

  const socLocked = settings?.socLimitSource === "defaults";

  return {
    settings,
    loading,
    saving,
    error,
    fromApi,
    socLocked,
    canWrite,
    patch,
    patchImmediate,
  };
}
