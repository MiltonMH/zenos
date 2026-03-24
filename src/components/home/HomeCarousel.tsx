import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChargerSlide } from "./slides/ChargerSlide";
import { MonthStatsSlide } from "./slides/MonthStatsSlide";
import { EnergyPriceSlide } from "./slides/EnergyPriceSlide";
import { useCarousel } from "@/hooks/useCarousel";

interface HomeCarouselProps {
  chargingMode: "idle" | "charging" | "v2h" | "v2g";
  onModeChange: (mode: "idle" | "charging" | "v2h" | "v2g") => void;
  onScheduleClick?: () => void;
}

export function HomeCarousel({ chargingMode, onModeChange, onScheduleClick }: HomeCarouselProps) {
  const slides = [
    { id: "charger", component: <ChargerSlide mode={chargingMode} onModeChange={onModeChange} onScheduleClick={onScheduleClick} /> },
    { id: "stats", component: <MonthStatsSlide /> },
    { id: "price", component: <EnergyPriceSlide /> },
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
    <div className="relative flex-1 flex flex-col">
      {/* Dot indicators */}
      <div className="flex justify-center gap-2 mb-4">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-primary w-3"
                : "bg-primary/30"
            }`}
          />
        ))}
      </div>

      {/* Carousel content */}
      <div 
        className="flex-1 relative overflow-hidden"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
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
            className="absolute inset-0"
          >
            {slides[currentSlide].component}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {canGoPrev && (
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}
        {canGoNext && (
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>
    </div>
  );
}
