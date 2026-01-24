"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ToCPage } from "@/components/pages/ToCPage";
import { AboutPage } from "@/components/pages/AboutPage";
import { ArtworksPage } from "@/components/pages/ArtworksPage";
import { DiscographyPage } from "@/components/pages/DiscographyPage";
import { VTuberModelsPage } from "@/components/pages/VTuberModelsPage";
import { cn } from "@/lib/utils";

// Page content type
export interface PageContent {
  Left: React.ComponentType;
  Right: React.ComponentType;
}

// Sections
export const sections = [
  "toc",
  "about",
  "artworks",
  "discography",
  "vtuber-models",
] as const;
export type Section = (typeof sections)[number];

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
  const [index, setIndex] = useState(1);

  const handleWheel = (e: React.WheelEvent) => {
    const direction = e.deltaY > 0 ? 1 : -1;
    setIndex((prev) => clamp(prev + direction*0.1, 1, sections.length));
  };

  return (
    <div
      className="absolute h-[90%] w-[90%] top-[5%] left-[5%] perspective-[1000px]"
      onClick={(e) => e.stopPropagation()}
      onWheel={handleWheel}
    >
      {sections.map((section, i) => {
        const offsetLeft = 180 - clamp(index - i, 0, 1) * 180;
        const offsetRight = clamp(index - i - 1, 0, 1) * -180;

        // Z-index logic: pages swap z-order at 90 degrees
        // Left pages: when open (< 90), show on top; when closed (>= 90), stack by index
        // Right pages: when open (> -90), show on top; when closed (<= -90), stack by reverse index
        const zLeft = offsetLeft < 90
          ? sections.length * 2 + i  // open: high z, ordered by i
          : sections.length - i;      // closed: stack with higher i on top

        const zRight = offsetRight > -90
          ? sections.length * 2 + (sections.length - i)  // open: high z
          : i;  // closed: stack with lower i on top

        return (
          <div key={section} className="contents">
            <div
              className="absolute bg-red-500 w-[50%] h-full top-0 origin-bottom-right rotate-z-10 backface-hidden"
              style={{
                transform: `rotateY(${offsetLeft}deg)`,
                zIndex: zLeft,
              }}
            >
              {section}
            </div>
            <div
              className={cn(
                "absolute bg-green-500 w-[50%] h-full top-0 origin-bottom-left rotate-z-10 right-0 backface-hidden",
                offsetLeft === 180 && "hidden"
              )}
              style={{
                transform: `rotateY(${offsetRight}deg)`,
                zIndex: zRight,
              }}
            >
              {section}
            </div>
          </div>
        );
      })}
    </div>
  );
}
