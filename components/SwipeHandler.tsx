"use client";

import { useRef, ReactNode, useEffect } from "react";

type SwipeHandlerProps = {
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  children: ReactNode;
};

export function SwipeHandler({ onSwipeLeft, onSwipeRight, children }: SwipeHandlerProps) {
  const touchStart = useRef<{ x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        onSwipeRight();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        onSwipeLeft();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onSwipeLeft, onSwipeRight]);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStart.current) return;

    const deltaX = e.changedTouches[0].clientX - touchStart.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStart.current.y;
    const minSwipeDistance = 50;

    // Only trigger if horizontal movement is greater than vertical
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > minSwipeDistance) {
      if (deltaX < 0) {
        onSwipeLeft();
      } else {
        onSwipeRight();
      }
    }

    touchStart.current = null;
  };

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="w-full h-full"
    >
      {children}
    </div>
  );
}
