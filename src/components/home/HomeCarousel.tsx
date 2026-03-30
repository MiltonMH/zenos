import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ChargerSlide } from "./slides/ChargerSlide";
import { MonthStatsSlide } from "./slides/MonthStatsSlide";
import { EnergyPriceSlide } from "./slides/EnergyPriceSlide";

const slideIds = ["charger", "stats", "price"] as const;
type SlideId = typeof slideIds[number];

interface HomeCarouselProps {
  userName: string;
  batteryLevel: number;
  chargingMode: "idle" | "charging" | "v2h" | "v2g" | "disconnected";
  onModeChange: (mode: "idle" | "charging" | "v2h" | "v2g" | "disconnected") => void;
  onBatteryLevelChange: (level: number) => void;
  onScheduleClick?: () => void;
  activeSlide?: SlideId;
  onSlideChange?: (slideId: SlideId) => void;
}

export function HomeCarousel({ userName, batteryLevel, chargingMode, onModeChange, onBatteryLevelChange, onScheduleClick, activeSlide, onSlideChange }: HomeCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const slides = [
    { id: "charger", component: <ChargerSlide mode={chargingMode} onModeChange={onModeChange} onScheduleClick={onScheduleClick} batteryLevel={batteryLevel} onBatteryLevelChange={onBatteryLevelChange} /> },
    { id: "stats", component: <MonthStatsSlide /> },
    { id: "price", component: <EnergyPriceSlide /> },
  ] as const;

  useEffect(() => {
    if (!activeSlide) {
      return;
    }

    const nextIndex = slideIds.indexOf(activeSlide);

    if (nextIndex !== -1 && nextIndex !== currentSlide) {
      setDirection(nextIndex > currentSlide ? 1 : -1);
      setCurrentSlide(nextIndex);
    }
  }, [activeSlide, currentSlide]);

  const setSlide = (index: number) => {
    setCurrentSlide(index);
    onSlideChange?.(slides[index].id);
  };

  const goToSlide = (index: number) => {
    setDirection(index > currentSlide ? 1 : -1);
    setSlide(index);
  };

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setDirection(1);
      setSlide(currentSlide + 1);
    }
  };

  const goPrev = () => {
    if (currentSlide > 0) {
      setDirection(-1);
      setSlide(currentSlide - 1);
    }
  };

  // Touch/swipe handling
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);
  const touchEndX = useRef(0);
  const touchEndY = useRef(0);
  const hasTouchMoved = useRef(false);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
    // Initialize end points so taps don't get treated like swipes.
    touchEndX.current = touchStartX.current;
    touchEndY.current = touchStartY.current;
    hasTouchMoved.current = false;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX;
    touchEndY.current = e.touches[0].clientY;
    hasTouchMoved.current = true;
  };

  const handleTouchEnd = () => {
    if (!hasTouchMoved.current) {
      return;
    }

    const diffX = touchStartX.current - touchEndX.current;
    const diffY = touchStartY.current - touchEndY.current;
    const isHorizontalSwipe = Math.abs(diffX) > Math.abs(diffY);

    if (isHorizontalSwipe && Math.abs(diffX) > 50) {
      if (diffX > 0) {
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

  const canGoPrev = currentSlide > 0;
  const canGoNext = currentSlide < slides.length - 1;

  return (
    <div className="relative flex-1 flex flex-col">
      <div className="mb-4 flex justify-center">
        <h1 className="text-lg font-semibold text-foreground">
          Hej, {userName}
        </h1>
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
