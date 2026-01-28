import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StatusSlide } from "./slides/StatusSlide";
import { OptimizationSlide } from "./slides/OptimizationSlide";
import { AdvancedSlide } from "./slides/AdvancedSlide";

export function SettingsCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  
  // Settings state
  const [v2hEnabled, setV2hEnabled] = useState(false);
  const [v2gEnabled, setV2gEnabled] = useState(false);
  const [dischargeLimit, setDischargeLimit] = useState([50]);
  const [optimizationMode, setOptimizationMode] = useState("balanced");
  const [minV2gBattery, setMinV2gBattery] = useState("70");
  const [conflictPriority, setConflictPriority] = useState("ai");
  const [timeRestriction, setTimeRestriction] = useState("always");
  
  const slides = [
    { 
      id: "status", 
      label: "Status",
      component: (
        <StatusSlide 
          v2hEnabled={v2hEnabled}
          v2gEnabled={v2gEnabled}
          onV2hChange={setV2hEnabled}
          onV2gChange={setV2gEnabled}
        />
      )
    },
    { 
      id: "optimization", 
      label: "AI",
      component: (
        <OptimizationSlide 
          dischargeLimit={dischargeLimit}
          optimizationMode={optimizationMode}
          onDischargeLimitChange={setDischargeLimit}
          onOptimizationModeChange={setOptimizationMode}
        />
      )
    },
    { 
      id: "advanced", 
      label: "Avancerat",
      component: (
        <AdvancedSlide 
          minV2gBattery={minV2gBattery}
          conflictPriority={conflictPriority}
          timeRestriction={timeRestriction}
          onMinV2gBatteryChange={setMinV2gBattery}
          onConflictPriorityChange={setConflictPriority}
          onTimeRestrictionChange={setTimeRestriction}
        />
      )
    },
  ];

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setCurrentSlide(index);
  };

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(currentSlide - 1);
    }
  };

  // Touch/swipe handling
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    const diff = touchStartX.current - touchEndX.current;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
    }),
  };

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
                : "bg-white/20 text-muted-foreground hover:bg-white/30"
            }`}
          >
            {slide.label}
          </button>
        ))}
      </div>

      {/* Carousel content */}
      <div 
        className="flex-1 relative overflow-hidden min-h-0"
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
            className="h-full w-full overflow-y-auto"
          >
            {slides[currentSlide].component}
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {currentSlide > 0 && (
          <button
            onClick={goPrev}
            className="absolute left-1 top-1/2 -translate-y-1/2 p-1 text-muted-foreground/50 hover:text-muted-foreground transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}
        {currentSlide < slides.length - 1 && (
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
