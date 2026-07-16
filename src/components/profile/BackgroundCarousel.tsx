import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronLeft, ChevronRight, Paintbrush } from "lucide-react";
import { backgrounds, type BackgroundOption } from "@/hooks/useBackground";
import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n";
import { getProfileTexts } from "@/lib/profile-i18n";

interface BackgroundCarouselProps {
  selected: BackgroundOption;
  onSelect: (bg: BackgroundOption) => void;
}

export function BackgroundCarousel({ selected, onSelect }: BackgroundCarouselProps) {
  const { language } = useLanguage();
  const texts = getProfileTexts(language).background;

  const [currentIndex, setCurrentIndex] = useState(() =>
    Math.max(0, backgrounds.findIndex((b) => b.id === selected))
  );
  const [direction, setDirection] = useState(0);
  const touchStartX = useRef(0);

  const goTo = (index: number) => {
    if (index < 0 || index >= backgrounds.length) return;
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const bg = backgrounds[currentIndex];
  const label = texts[bg.id];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 200 : -200, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -200 : 200, opacity: 0 }),
  };

  return (
    <div className="glass-subtle rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-2 mb-1">
        <Paintbrush className="w-4 h-4 text-primary" />
        <h3 className="font-medium text-foreground text-sm">{texts.title}</h3>
      </div>

      {/* Carousel */}
      <div
        className="relative h-44 overflow-hidden rounded-2xl"
        onTouchStart={(e) => (touchStartX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          const diff = touchStartX.current - e.changedTouches[0].clientX;
          if (Math.abs(diff) > 40) {
            goTo(currentIndex + (diff > 0 ? 1 : -1));
          }
        }}
      >
        <AnimatePresence mode="wait" custom={direction}>
          <motion.button
            key={bg.id}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => onSelect(bg.id)}
            className={cn(
              "absolute inset-0 w-full h-full rounded-2xl border-2 transition-colors",
              selected === bg.id
                ? "border-primary ring-2 ring-primary/30"
                : "border-white/30"
            )}
          >
            {bg.image ? (
              <img src={bg.image} alt={label} className="absolute inset-0 w-full h-full object-cover rounded-2xl" />
            ) : (
              <div className={cn("absolute inset-0 rounded-2xl", bg.preview)} />
            )}
            {selected === bg.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                  <Check className="w-4 h-4 text-primary-foreground" />
                </div>
              </div>
            )}
            <span
              className={cn(
                "absolute bottom-3 left-0 right-0 text-center text-sm font-medium",
                bg.id === "black" ? "text-white" : "text-foreground"
              )}
            >
              {label}
            </span>
          </motion.button>
        </AnimatePresence>

        {/* Arrows */}
        {currentIndex > 0 && (
          <button
            onClick={() => goTo(currentIndex - 1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/60 backdrop-blur-sm text-foreground/70 hover:text-foreground"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
        {currentIndex < backgrounds.length - 1 && (
          <button
            onClick={() => goTo(currentIndex + 1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/60 backdrop-blur-sm text-foreground/70 hover:text-foreground"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Dots */}
      <div className="flex justify-center gap-1.5">
        {backgrounds.map((b, i) => (
          <button
            key={b.id}
            onClick={() => goTo(i)}
            className={cn(
              "w-1.5 h-1.5 rounded-full transition-all duration-300",
              i === currentIndex ? "bg-primary w-4" : "bg-muted-foreground/30"
            )}
          />
        ))}
      </div>
    </div>
  );
}
