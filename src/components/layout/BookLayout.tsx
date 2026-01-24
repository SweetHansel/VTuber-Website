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
    setIndex((prev) => clamp(prev + direction*0.1, 0, sections.length));
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
        console.log(section, offsetLeft)
        return (
          <div key={section} className="contents">
            <div
              className={cn("absolute bg-red-500 w-[50%] h-full top-0 origin-bottom-right rotate-z-10 backface-hidden",
                "z-"+(sections.length+1-i)
              )}
              style={{
                transform: "rotateY(" + offsetLeft + "deg)",
              }}
            >
              {section}
            </div>
            <div
              className={cn("absolute bg-green-500 w-[50%] h-full top-0 origin-bottom-left rotate-z-10 right-0 backface-hidden",
                "z-"+(sections.length+1-i),
                offsetLeft == 180 ? "hidden" :""
              )}
              style={{
                transform: "rotateY(" + offsetRight + "deg)",
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
