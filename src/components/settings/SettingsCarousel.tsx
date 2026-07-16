import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusSlide } from "./slides/StatusSlide";
import { OptimizationSlide } from "./slides/OptimizationSlide";
import { useCarousel } from "@/hooks/useCarousel";
import { useLanguage } from "@/lib/i18n";
import { getSettingsTexts } from "@/lib/settings-i18n";

export function SettingsCarousel() {
  const { language } = useLanguage();
  const settings = getSettingsTexts(language);

  // Settings state
  const [chargeLimit, setChargeLimit] = useState([90]);
  const [v2hEnabled, setV2hEnabled] = useState(false);
  const [v2gEnabled, setV2gEnabled] = useState(false);
  const [dischargeLimit, setDischargeLimit] = useState([50]);
  const [optimizationMode, setOptimizationMode] = useState("balanced");

  const slides = [
    {
      id: "status",
      label: settings.tabCharging,
      component: (
        <StatusSlide
          chargeLimit={chargeLimit}
          onChargeLimitChange={setChargeLimit}
        />
      )
    },
    {
      id: "v2x",
      label: settings.tabV2x,
      component: (
        <OptimizationSlide
          v2hEnabled={v2hEnabled}
          v2gEnabled={v2gEnabled}
          dischargeLimit={dischargeLimit}
          optimizationMode={optimizationMode}
          onV2hChange={setV2hEnabled}
          onV2gChange={setV2gEnabled}
          onDischargeLimitChange={setDischargeLimit}
          onOptimizationModeChange={setOptimizationMode}
        />
      )
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
      {/* Tab indicators */}
      <div className="flex justify-center gap-2 px-4 py-3">
        {slides.map((slide, index) => (
          <button
            key={slide.id}
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

      {/* Carousel content */}
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

        {/* Navigation arrows */}
        {canGoPrev && (
          <button
            onClick={goPrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {canGoNext && (
          <button
            onClick={goNext}
            className="absolute right-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
