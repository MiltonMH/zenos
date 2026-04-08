import { useState, useRef, useCallback } from "react";
import { useHaptics } from "@/hooks/useHaptics";

interface UseCarouselOptions {
  totalSlides: number;
  swipeThreshold?: number;
}

export function useCarousel({ totalSlides, swipeThreshold = 50 }: UseCarouselOptions) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);
  const { lightImpact, selectionChanged } = useHaptics();

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < totalSlides) {
      setDirection(index > currentSlide ? 1 : -1);
      setCurrentSlide(index);
      lightImpact();
    }
  }, [currentSlide, totalSlides, lightImpact]);

  const goNext = useCallback(() => {
    if (currentSlide < totalSlides - 1) {
      setDirection(1);
      setCurrentSlide(prev => prev + 1);
      selectionChanged();
    }
  }, [currentSlide, totalSlides, selectionChanged]);

  const goPrev = useCallback(() => {
    if (currentSlide > 0) {
      setDirection(-1);
      setCurrentSlide(prev => prev - 1);
      selectionChanged();
    }
  }, [currentSlide, selectionChanged]);

  // Attach move/up to document on drag start so motion is captured
  // everywhere regardless of which child element the pointer drifts over.
  const handleTouchStart = useCallback((e: React.PointerEvent) => {
    if ((e.target as HTMLElement).closest('button, a, [role="button"], input, select, textarea')) return;

    const startX = e.clientX;
    let endX = startX;

    const onMove = (ev: PointerEvent) => { endX = ev.clientX; };

    const onUp = () => {
      document.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('pointercancel', onUp);

      const diff = startX - endX;
      if (Math.abs(diff) > swipeThreshold) {
        if (diff > 0) goNext(); else goPrev();
      }
    };

    document.addEventListener('pointermove', onMove);
    document.addEventListener('pointerup', onUp);
    document.addEventListener('pointercancel', onUp);
  }, [swipeThreshold, goNext, goPrev]);

  // Kept for API compatibility — logic is now inside handleTouchStart
  const handleTouchMove = useCallback((_e: React.PointerEvent) => {}, []);
  const handleTouchEnd = useCallback(() => {}, []);

  const canGoNext = currentSlide < totalSlides - 1;
  const canGoPrev = currentSlide > 0;

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

  return {
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
  };
}
