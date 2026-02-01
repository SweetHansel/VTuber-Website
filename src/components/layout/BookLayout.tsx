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
  useTransform,
  type MotionValue,
} from "framer-motion";

// Page content type - components receive isActive prop

export interface LRProps {
  index: MotionValue<number>;
}
export interface PageContent {
  Left: React.ComponentType<LRProps>;
  Right: React.ComponentType<LRProps>;
}

// Utility
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

// Separate components for left and right pages
interface PageProps {
  index: MotionValue<number>;
  pageIndex: number;
  Page: PageContent;
}

function LeftPage({ index, pageIndex, Page }: PageProps) {
  const rotateY = useTransform(
    index,
    (v) => 180 - (clamp(v - pageIndex, 0.25, 0.75) - 0.25) * 2 * 180,
  );
  const innerPageTransforms = useTransform(index, (v) => {
    return v - pageIndex < 0.5
      ? clamp(v - pageIndex, 0, 0.25) * 2
      : clamp(v - pageIndex, 0.75, 1) * 2 - 1;
  });
  return (
    <motion.div
      className="absolute bg-[var(--bg-primary)] w-[50%] h-full top-0 origin-bottom-right backface-hidden transform-flat"
      style={{ rotateY }}
      transition={{ duration: 0.3, bounce: 0 }}
    >
      <Page.Left index={innerPageTransforms} />
    </motion.div>
  );
}

function RightPage({ index, pageIndex, Page }: PageProps) {
  const rotateY = useTransform(
    index,
    (v) => (clamp(v - pageIndex - 1, 0.25, 0.75) - 0.25) * 2 * -180,
  );
  const innerPageTransforms = useTransform(index, (v) => {
    return v - pageIndex -1 <= 0
      ? clamp(v - pageIndex - 1, -0.25, 0) * 2 +0.5 
      : clamp(v - pageIndex - 1, 0, 0.25) * 2 +0.5 ;
  });

  return (
    <motion.div
      className="absolute bg-[var(--bg-primary)] w-[50%] h-full top-0 origin-bottom-left backface-hidden transform-flat"
      style={{ rotateY, translateX: "100%" }}
      transition={{ duration: 0.3, bounce: 0 }}
    >
      <Page.Right index={innerPageTransforms} />
    </motion.div>
  );
}

const sections = ["about", "artworks", "discography", "vtuber-models"];

// Page mapping
const pages: Record<string, PageContent> = {
  about: AboutPage,
  artworks: ArtworksPage,
  discography: DiscographyPage,
  "vtuber-models": VTuberModelsPage,
};

export function BookLayout() {
  const index = useMotionValue(0);

  const isScrollingRef = useRef(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<number | null>(null);

  const setIndexAnimated = (val: number) => {
    animate(index, val, { duration: 0.5, bounce: 0 });
  };

  // Controls prev/ToC buttons (visible when index >= 1)
  const showPrevButtons = useTransform(index, (v) =>
    Number.isInteger(v) && v >= 1 ? "visible" : "hidden",
  );

  // Controls next button (visible when index < sections.length)
  const showNextButton = useTransform(index, (v) =>
    Number.isInteger(v) && v < sections.length ? "visible" : "hidden",
  );

  const handleWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY > 0 ? 1 : -1;
    animate(index, clamp(index.get() + direction * 0.1, 0, sections.length), {
      type: "spring",
      duration: 0.1,
      bounce: 0,
    });

    isScrollingRef.current = true;

    if (scrollTimeoutRef.current) {
      clearTimeout(scrollTimeoutRef.current);
    }

    scrollTimeoutRef.current = setTimeout(() => {
      isScrollingRef.current = false;

      // Decay to nearest page when scrolling stops
      const current = index.get();
      const target = Math.round(current);
      if (!Number.isInteger(current)) {
        animate(index, target, { type: "spring", duration: 2, bounce: 0 });
      }
    }, 100);
  };

  // Touch/swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartRef.current === null) return;

    const diff = touchStartRef.current - e.touches[0].clientX;
    index.set(clamp(index.get() + diff * 0.01, 0, sections.length));
    touchStartRef.current = e.touches[0].clientX;

    isScrollingRef.current = true;
  };

  const handleTouchEnd = () => {
    touchStartRef.current = null;
    isScrollingRef.current = false;

    // Decay to nearest page when touch ends
    const current = index.get();
    const target = Math.round(current);
    if (!Number.isInteger(current)) {
      animate(index, target, {
        type: "spring",
        duration: 0.3,
        bounce: 0,
      });
    }
  };

  const nextPage = () => {
    setIndexAnimated(Math.round(index.get()) + 1);
  };

  const prevPage = () => {
    setIndexAnimated(Math.round(index.get()) - 1);
  };

  return (
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
          Page={pages[section]}
        />
      ))}
      {/* Right pages rendered in reverse DOM order to fix 3D stacking */}
      {sections.toReversed().map((section, i) => (
        <RightPage
          key={`right-${section}`}
          index={index}
          pageIndex={sections.length - i - 1}
          Page={pages[section]}
        />
      ))}

      <motion.div
        className="absolute h-full w-full pointer-events-none"
        style={{ visibility: showPrevButtons }}
      >
        <button
          onClick={prevPage}
          className="absolute bottom-0 left-0 w-0 h-0 z-50 cursor-pointer pointer-events-auto
            border-b-[60px] border-b-white/20
            border-r-[60px] border-r-transparent
            hover:border-b-white/40 transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="absolute bottom-[-50px] left-[5px] w-4 h-4 text-white/60" />
        </button>

        <button
          onClick={() => setIndexAnimated(0)}
          className="absolute top-0 left-0 w-0 h-0 z-50 cursor-pointer pointer-events-auto
            border-t-[60px] border-t-white/20
            border-r-[60px] border-r-transparent
            hover:border-t-white/40 transition-colors"
          aria-label="ToC"
        >
          <ListTree className="absolute top-[-50px] left-[5px] w-4 h-4 text-white/60" />
        </button>
      </motion.div>

      <motion.div
        className="absolute h-full w-full pointer-events-none"
        style={{ visibility: showNextButton }}
      >
        <button
          onClick={nextPage}
          className="absolute bottom-0 right-0 w-0 h-0 z-50 cursor-pointer pointer-events-auto
            border-b-[60px] border-b-white/20
            border-l-[60px] border-l-transparent
            hover:border-b-white/40 transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="absolute bottom-[-50px] right-[5px] w-4 h-4 text-white/60" />
        </button>
      </motion.div>
    </div>
  );
}
