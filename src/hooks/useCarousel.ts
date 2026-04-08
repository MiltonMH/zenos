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

  const pointerStartX = useRef(0);
  const pointerEndX = useRef(0);
  const isPointerDown = useRef(false);

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

  const handleTouchStart = useCallback((e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    pointerEndX.current = e.clientX;
    isPointerDown.current = true;
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const handleTouchMove = useCallback((e: React.PointerEvent) => {
    if (!isPointerDown.current) return;
    pointerEndX.current = e.clientX;
  }, []);

  const handleTouchEnd = useCallback(() => {
    if (!isPointerDown.current) return;
    isPointerDown.current = false;
    const diff = pointerStartX.current - pointerEndX.current;
    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        goNext();
      } else {
        goPrev();
      }
    }
  }, [swipeThreshold, goNext, goPrev]);

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
