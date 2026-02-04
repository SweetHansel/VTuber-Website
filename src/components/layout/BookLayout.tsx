"use client";

import { useRef } from "react";
import { AboutPage } from "@/components/pages/AboutPage";
import { ArtworksPage } from "@/components/pages/ArtworksPage";
import { DiscographyPage } from "@/components/pages/DiscographyPage";
import { VTuberModelsPage } from "@/components/pages/VTuberModelsPage";
import { ChevronLeft, ChevronRight, ListTree } from "lucide-react";
import {
  animate,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { CONTENT_SECTIONS } from "@/constants/sections";
import { cn } from "@/lib/utils";
import { AspectLock } from "./AspectLock";
import { InteractiveMediaFromCMS } from "@/components/media";
import { useLayoutStore } from "@/stores/layoutStore";
import { LeftPage, LRProps, RightPage, ToCPage } from "./book";

// Re-export types for backwards compatibility
export { mapToFlatOnly, ExpandingPage, type LRProps } from "./book";

// Utility
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const sections = CONTENT_SECTIONS;

// Page mapping
const pages: Record<string, React.ComponentType<LRProps>[]> = {
  about: AboutPage,
  artworks: ArtworksPage,
  discography: DiscographyPage,
  "vtuber-models": VTuberModelsPage,
};

export function BookLayout() {
  const { focusState, setFocus } = useLayoutStore();
  const rough = useMotionValue(0);
  const index = useSpring(rough, { stiffness: 20, damping: 10 });

  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number | null>(null);

  const setIndex = (val: number) => {
    rough.set(val);
  };

  // Controls prev/ToC buttons (visible when index > 0)
  const showPrevButtons = useTransform(index, (v) =>
    Number.isInteger(v) && v > 0 ? "visible" : "hidden",
  );

  // Controls next button (visible when index < sections.length)
  const showNextButton = useTransform(index, (v) =>
    Number.isInteger(v) && v < sections.length ? "visible" : "hidden",
  );

  const handleWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY > 0 ? 1 : -1;
    rough.set(clamp(rough.get() + direction * 0.1, 0, sections.length));

    isScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;
      // Decay to nearest page when scrolling stops
      setIndex(Math.round(index.get()));
    }, 500);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;

    const diff = touchStartRef.current - e.touches[0].clientX;
    rough.set(clamp(rough.get() + diff * 0.01, 0, sections.length));
    touchStartRef.current = e.touches[0].clientX;

    isScrollingRef.current = true;
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    isScrollingRef.current = false;

    setIndex(Math.round(index.get()));
  };

  const nextPage = () => {
    setIndex(Math.round(index.get()) + 1);
  };

  const prevPage = () => {
    setIndex(Math.round(index.get()) - 1);
  };

  return (
    <AspectLock
      aspectRatio={16 / 9}
      anchorX="left"
      anchorY="top"
      className="absolute perspective-1000 transform-3d pointer-events-none"
    >
      <div
        className={cn(
          "h-full w-full pointer-events-auto",
          focusState == "default" && "rotate-x-10 -rotate-z-5",
        )}
        onClick={(e) => {
          if (focusState == "default") setFocus("bottom-right");
          e.stopPropagation();
        }}
      >
        <InteractiveMediaFromCMS
          showEmpty
          location="landing-bottom-right"
          className="absolute h-[102%] w-[102%] top-[-1%] left-[-2%] object-contain"
        />
        <div className="absolute h-[98%] w-[98%] top-[1%] left-0">
          <div
            className="absolute h-full w-full perspective-[1000px]"
            onClick={(e) => e.stopPropagation()}
            onWheel={handleWheel}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
          >
            {sections.map((section, i) => (
              <LeftPage
                key={`left-${section}`}
                index={index}
                pageIndex={i}
                Page={pages[section][0]}
                onNavigate={setIndex}
              />
            ))}
            {/* Right pages rendered in reverse DOM order to fix 3D stacking */}
            {sections.toReversed().map((section, i) => (
              <RightPage
                key={`right-${section}`}
                index={index}
                pageIndex={sections.length - i - 1}
                Page={pages[section][1]}
                onNavigate={setIndex}
              />
            ))}
            {/* ToC Page (index 0, only has right side with content) */}
            <RightPage
              key="right-toc"
              index={index}
              pageIndex={-1}
              Page={ToCPage}
              onNavigate={setIndex}
            />

            <motion.div
              className="absolute h-full w-full pointer-events-none"
              style={{ visibility: showPrevButtons }}
            >
              <button
                onClick={prevPage}
                className="absolute bottom-0 left-0 w-0 h-0 z-50 cursor-pointer pointer-events-auto
            border-b-60 border-b-(--page-surface)/20
            border-r-60 border-r-transparent
            hover:border-b-(--page-surface)/40 transition-colors"
                aria-label="Previous page"
              >
                <ChevronLeft className="absolute -bottom-12.5 left-1.25 w-4 h-4 text-(--page-text)/60" />
              </button>

              <button
                onClick={() => setIndex(0)}
                className="absolute top-0 left-0 w-0 h-0 z-50 cursor-pointer pointer-events-auto
            border-t-60 border-t-(--page-surface)/20
            border-r-60 border-r-transparent
            hover:border-t-(--page-surface)/40 transition-colors"
                aria-label="ToC"
              >
                <ListTree className="absolute -top-12.5 left-1.25 w-4 h-4 text-(--page-text)/60" />
              </button>
            </motion.div>

            <motion.div
              className="absolute h-full w-full pointer-events-none"
              style={{ visibility: showNextButton }}
            >
              <button
                onClick={nextPage}
                className="absolute bottom-0 right-0 w-0 h-0 z-50 cursor-pointer pointer-events-auto
            border-b-60 border-b-(--page-surface)/20
            border-l-60 border-l-transparent
            hover:border-b-(--page-surface)/40 transition-colors"
                aria-label="Next page"
              >
                <ChevronRight className="absolute -bottom-12.5 right-1.25 w-4 h-4 text-(--page-text)/60" />
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </AspectLock>
  );
}
