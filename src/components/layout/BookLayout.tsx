"use client";

import { useEffect, useRef } from "react";
import { ToCPage } from "@/components/pages/ToCPage";
import { AboutPage } from "@/components/pages/AboutPage";
import { ArtworksPage } from "@/components/pages/ArtworksPage";
import { DiscographyPage } from "@/components/pages/DiscographyPage";
import { VTuberModelsPage } from "@/components/pages/VTuberModelsPage";
import { useBookStore, sections, type Section } from "@/stores/bookStore";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, ListTree } from "lucide-react";
import { motion } from "framer-motion";

// Page content type
export interface PageContent {
  Left: React.ComponentType;
  Right: React.ComponentType;
}

// Utility
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

// Page mapping
const pages: Record<Section, PageContent> = {
  toc: ToCPage,
  about: AboutPage,
  artworks: ArtworksPage,
  discography: DiscographyPage,
  "vtuber-models": VTuberModelsPage,
};

export function BookLayout() {
  const { index, setIndex, nextPage, prevPage } = useBookStore();
  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number | null>(null);

  // Decay toward nearest whole number when not scrolling
  useEffect(() => {
    let animationId: number;

    const decay = () => {
      if (!isScrollingRef.current) {
        setIndex((prev) => {
          const target = Math.round(prev);
          const diff = target - prev;

          // If close enough, snap to target
          if (Math.abs(diff) < 0.01) return target;

          // Move toward target with decay factor
          return prev + diff * 0.15;
        });
      }
      animationId = requestAnimationFrame(decay);
    };

    animationId = requestAnimationFrame(decay);
    return () => cancelAnimationFrame(animationId);
  }, [setIndex]);

  const handleWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY > 0 ? 1 : -1;
    setIndex((prev) => clamp(prev + direction * 0.1, 1, sections.length));

    isScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
    }, 100);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;

    const diff = touchStartRef.current - e.touches[0].clientX;
    setIndex((prev) => clamp(prev + diff * 0.005, 1, sections.length));
    touchStartRef.current = e.touches[0].clientX;

    isScrollingRef.current = true;
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    isScrollingRef.current = false;
  };

  const currentPage = Math.round(index);
  const canGoPrev = currentPage > 1;
  const canGoNext = currentPage < sections.length;

  return (
    <div
      className="absolute h-[90%] w-[90%] top-[5%] left-[5%] perspective-[1000px]"
      onClick={(e) => e.stopPropagation()}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {sections.map((section, i) => {
        const Page = pages[section];
        const offsetLeft = 180 - clamp(index - i, 0, 1) * 180;
        const offsetRight = clamp(index - i - 1, 0, 1) * -180;

        // Z-index logic: pages swap z-order at 90 degrees
        const zLeft = offsetLeft < 90
          ? sections.length * 2 + i
          : sections.length - i;

        const zRight = offsetRight > -90
          ? sections.length * 2 + (sections.length - i)
          : i;

        return (
          <div key={section} className="contents">
            <motion.div
              className="absolute bg-blue-900 w-[50%] h-full top-0 origin-bottom-right rotate-z-10 backface-hidden overflow-hidden"
              style={{
                transform: `rotateY(${offsetLeft}deg)`,
                zIndex: zLeft,
              }}
            >
              <Page.Left />
            </motion.div>
            <motion.div
              className={cn(
                "absolute bg-blue-900 w-[50%] h-full top-0 origin-bottom-left rotate-z-10 right-0 backface-hidden overflow-hidden",
                offsetLeft === 180 && "hidden"
              )}
              style={{
                transform: `rotateY(${offsetRight}deg)`,
                zIndex: zRight,
              }}
            >
              <Page.Right />
            </motion.div>
          </div>
        );
      })}

      {/* Triangle navigation overlays */}
      {Number.isInteger(index) &&  canGoPrev && (
        <button
          onClick={prevPage}
          className="absolute bottom-0 left-0 w-0 h-0 z-50 cursor-pointer
            border-b-[60px] border-b-white/20
            border-r-[60px] border-r-transparent
            hover:border-b-white/40 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="absolute bottom-[-50px] left-[5px] w-4 h-4 text-white/60" />
        </button>
      )}
      { Number.isInteger(index) &&  canGoNext && (
        <button
          onClick={nextPage}
          className="absolute bottom-0 right-0 w-0 h-0 z-50 cursor-pointer
            border-b-[60px] border-b-white/20
            border-l-[60px] border-l-transparent
            hover:border-b-white/40 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="absolute bottom-[-50px] right-[5px] w-4 h-4 text-white/60" />
        </button>
      )}
      
      {Number.isInteger(index) && index >=2 && (
        <button
          onClick={()=>setIndex(1)}
          className="absolute top-0 left-0 w-0 h-0 z-50 cursor-pointer
            border-t-[60px] border-t-white/20
            border-r-[60px] border-r-transparent
            hover:border-t-white/40 transition-colors"
          aria-label="ToC"
        >
          <ListTree className="absolute top-[-50px] left-[5px] w-4 h-4 text-white/60" />
        </button>
      )}
    </div>
  );
}
