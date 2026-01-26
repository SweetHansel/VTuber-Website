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

// Page content type
export interface PageContent {
  Left: React.ComponentType;
  Right: React.ComponentType;
}

// Separate component to properly use hooks
interface PageSpreadProps {
  index: MotionValue<number>;
  pageIndex: number;
  Page: PageContent;
}

function PageSpread({ index, pageIndex, Page }: PageSpreadProps) {
  const left = useTransform(
    index,
    (v) => 180 - clamp(v - pageIndex, 0, 1) * 180,
  );
  const right = useTransform(
    index,
    (v) => clamp(v - pageIndex - 1, 0, 1) * -180,
  );
  const zLeft = useTransform(index, (v) =>
    clamp(v - pageIndex, 0, 1) < 0.5 ? 2 : 0,
  );
  const zRight = useTransform(index, (v) =>
    clamp(v - pageIndex - 1, 0, 1.1) < 1 ? (10 - pageIndex)*3 : 0,
  );

  return (
    <>
      <motion.div
        className="absolute bg-blue-900 w-[50%] h-full top-0 origin-bottom-right rotate-z-10 backface-hidden"
        style={{ rotateY: left, zIndex: zLeft }}
      >
        <Page.Left />
      </motion.div>
      <motion.div
        className="absolute bg-blue-900 w-[50%] h-full top-0 origin-bottom-left rotate-z-10 right-0 backface-hidden"
        style={{ rotateY: right, zIndex: zRight }}
      >
        <Page.Right />
      </motion.div>
    </>
  );
}

// Utility
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

const sections = ["about", "artworks", "discography", "vtuber-models"];

const sectionLabel: Record<string, string> = {
  about: "About Me",
  artworks: "Artworks",
  discography: "Discography",
  "vtuber-models": "VTuber Models",
};

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
    animate(index, val, { duration: 0.5 });
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
    index.set(clamp(index.get() + direction * 0.15, 0, sections.length));

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
        animate(index, target, { type: "spring",
    duration: 0.2, stiffness: 300, damping: 10 });
      }
    }, 250);
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
        stiffness: 300,
        visualDuration: 0.5,
        damping: 30,
      });
    }
  };

  const left = useTransform(index, (index) => {
    return 180 - clamp(index + 1, 0, 1) * 180;
  });

  const right = useTransform(index, (index) => {
    return clamp(index, 0, 1) * -180;
  });

  const zLeft = useTransform(index, (index) => {
    return index < 0.5 ? 2 : 0;
  });

  const zRight = useTransform(index, (index) => {
    return index < 1.5 ? 33 : 0;
  });

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
      <motion.div
        className="absolute bg-blue-900 w-[50%] h-full top-0 origin-bottom-right rotate-z-10 backface-hidden  items-center justify-center flex p-8"
        style={{ rotateY: left, zIndex: zLeft }}
      >
          <h2 className="text-3xl font-bold">
            Welcome
          </h2>
      </motion.div>

      <motion.div
        className="absolute bg-blue-900 w-[50%] h-full top-0 origin-bottom-left rotate-z-10 right-0 backface-hidden  items-center justify-center flex p-8"
        style={{ rotateY: right, zIndex: zRight }}
      >
        
        <ul className="space-y-2">
          {sections.map((section, i) => (
            <li key={section} onClick={() => setIndexAnimated(i + 1)}>
              <button className="text-white/70 hover:text-white transition-colors text-left">
                {sectionLabel[section]}
              </button>
            </li>
          ))}
        </ul>
      </motion.div>

      {sections.map((section, i) => (
        <PageSpread
          key={section}
          index={index}
          pageIndex={i}
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
