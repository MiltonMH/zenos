import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusSlide } from "./slides/StatusSlide";
import { OptimizationSlide } from "./slides/OptimizationSlide";
import { useCarousel } from "@/hooks/useCarousel";
import { useSiteData } from "@/hooks/useSiteData";
import { useChargingSettings } from "@/hooks/useChargingSettings";
import { mapDerStatusToSettingsUi, toPercentSlider } from "@/lib/numiz-mappers";
import { toast } from "@/hooks/use-toast";
import { useLanguage } from "@/lib/i18n";
import { getSettingsTexts } from "@/lib/settings-i18n";
import type { OptimizationMode } from "@/lib/numiz-types";

/**
 * Settings state strategy:
 * - Server SoT: GET/PUT /devices/{id}/charging-settings (useChargingSettings)
 * - Local UI mirrors server for immediate slider feedback; sliders debounce PUT
 * - Status/firmware still from useSiteData (read-only)
 * Styling: existing Tailwind + ApiField borders (blue = API, red = mock/missing)
 */
export function SettingsCarousel() {
  const { language } = useLanguage();
  const settingsTexts = getSettingsTexts(language);
  const { view, hasApiData, me, chargerDevice } = useSiteData();

  const canWrite = me?.role === "SITE_OWNER" || me?.role === "ADMIN";
  const deviceId = chargerDevice?.id ?? null;

  const {
    settings,
    fromApi,
    socLocked,
    canWrite: writeEnabled,
    saving,
    error,
    patch,
    patchImmediate,
  } = useChargingSettings(deviceId, canWrite);

  const lastErrorToast = useRef<string | null>(null);
  useEffect(() => {
    if (!error || error === lastErrorToast.current) return;
    lastErrorToast.current = error;
    const description =
      error === "FORBIDDEN"
        ? settingsTexts.save.forbidden
        : error === "UNAUTHORIZED"
          ? settingsTexts.save.unauthorized
          : settingsTexts.save.failed;
    toast({
      title: settingsTexts.save.errorTitle,
      description,
      variant: "destructive",
    });
  }, [error, settingsTexts.save]);

  useEffect(() => {
    if (!error) lastErrorToast.current = null;
  }, [error]);

  const chargeLimit = toPercentSlider(settings?.maxChargeSocPercent ?? 90, 90);
  const dischargeLimit = toPercentSlider(settings?.minDischargeSocPercent ?? 50, 50);
  const v2hEnabled = settings?.v2hEnabled ?? false;
  const v2gEnabled = settings?.v2gEnabled ?? false;
  const optimizationMode: OptimizationMode = settings?.optimizationMode ?? "balanced";

  const controlsDisabled = !writeEnabled || !fromApi || !deviceId;
  const socDisabled = controlsDisabled || socLocked;

  const uiStatus = mapDerStatusToSettingsUi(view.derStatus);
  const firmwareVersion = view.chargerVersion;
  const statusFromApi = hasApiData && view.derStatus != null;
  const versionFromApi = view.fromApi.chargerVersion;
  const chargeLimitFromApi = fromApi && settings != null;
  const dischargeLimitFromApi = fromApi && settings != null;
  const v2hFromApi = fromApi && settings != null;
  const v2gFromApi = fromApi && settings != null;
  const modeFromApi = fromApi && settings != null;

  const handleChargeLimitChange = (value: number[]) => {
    const next = value[0];
    if (next == null || socDisabled) return;
    patch({ maxChargeSocPercent: next });
  };

  const handleDischargeLimitChange = (value: number[]) => {
    const next = value[0];
    if (next == null || socDisabled) return;
    patch({ minDischargeSocPercent: next });
  };

  const handleV2hChange = (enabled: boolean) => {
    if (controlsDisabled) return;
    if (enabled && socLocked) {
      toast({
        title: settingsTexts.save.errorTitle,
        description: settingsTexts.save.unknownVehicle,
        variant: "destructive",
      });
      return;
    }
    void patchImmediate({ v2hEnabled: enabled });
  };

  const handleV2gChange = (enabled: boolean) => {
    if (controlsDisabled) return;
    if (enabled && socLocked) {
      toast({
        title: settingsTexts.save.errorTitle,
        description: settingsTexts.save.unknownVehicle,
        variant: "destructive",
      });
      return;
    }
    void patchImmediate({ v2gEnabled: enabled });
  };

  const handleOptimizationModeChange = (mode: string) => {
    if (controlsDisabled) return;
    if (mode !== "savings" && mode !== "balanced" && mode !== "protection") return;
    void patchImmediate({ optimizationMode: mode });
  };

  const handleRestart = () => {
    toast({
      title: settingsTexts.status.restartTitle,
      description: settingsTexts.status.restartNotReady,
    });
  };

  const slides = [
    {
      id: "status",
      label: settingsTexts.tabCharging,
      component: (
        <StatusSlide
          chargeLimit={chargeLimit}
          onChargeLimitChange={handleChargeLimitChange}
          status={uiStatus}
          firmwareVersion={firmwareVersion}
          statusFromApi={statusFromApi}
          versionFromApi={versionFromApi}
          chargeLimitFromApi={chargeLimitFromApi}
          chargeLimitDisabled={socDisabled}
          onRestart={handleRestart}
          saving={saving}
        />
      ),
    },
    {
      id: "v2x",
      label: settingsTexts.tabV2x,
      component: (
        <OptimizationSlide
          v2hEnabled={v2hEnabled}
          v2gEnabled={v2gEnabled}
          dischargeLimit={dischargeLimit}
          optimizationMode={optimizationMode}
          onV2hChange={handleV2hChange}
          onV2gChange={handleV2gChange}
          onDischargeLimitChange={handleDischargeLimitChange}
          onOptimizationModeChange={handleOptimizationModeChange}
          dischargeLimitFromApi={dischargeLimitFromApi}
          v2hFromApi={v2hFromApi}
          v2gFromApi={v2gFromApi}
          modeFromApi={modeFromApi}
          dischargeDisabled={socDisabled}
          togglesDisabled={controlsDisabled}
          v2xEnableLocked={socLocked}
          saving={saving}
        />
      ),
    },
  ];

  const {
    currentSlide,
    direction,
    goToSlide,
    goNext,
    goPrev,
    canGoNext,
    canGoPrev,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    variants,
  } = useCarousel({ totalSlides: slides.length });

  return (
    <div className="flex-1 flex flex-col min-h-0">
      <div className="flex justify-center gap-2 px-4 py-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
            type="button"
            onClick={() => goToSlide(index)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary text-primary-foreground"
                : "gradient-stroke-ring bg-white/20 text-muted-foreground hover:bg-white/30"
            }`}
          >
            {slide.label}
          </button>
        ))}
      </div>

      <div
        className="flex-1 relative overflow-hidden min-h-0"
        onPointerDown={handleTouchStart}
        onPointerMove={handleTouchMove}
        onPointerUp={handleTouchEnd}
        onPointerCancel={handleTouchEnd}
        style={{ touchAction: "pan-y", userSelect: "none" }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={currentSlide}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="h-full w-full overflow-y-auto"
          >
            {slides[currentSlide].component}
          </motion.div>
        </AnimatePresence>

        {canGoPrev && (
          <button
            type="button"
            onClick={goPrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            aria-label={settingsTexts.tabCharging}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canGoNext && (
          <button
            type="button"
            onClick={goNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            aria-label={settingsTexts.tabV2x}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
