"use client";

import { useState } from "react";
import { motion, useTransform } from "framer-motion";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
import { staggerContainerVariants, staggerItemVariants } from "@/animations";
import { cn } from "@/lib/utils";
import type { LRProps, PageContent } from "@/components/layout/BookLayout";
import { InteractiveMediaFromCMS } from "../layout/InteractiveMediaFromCMS";

type ArtworkFilter = "all" | "fanart" | "official" | "meme";

const filters: { label: string; value: ArtworkFilter }[] = [
  { label: "All", value: "all" },
  { label: "Fan Art", value: "fanart" },
  { label: "Official", value: "official" },
];

function ArtworksLeft({ index }: LRProps) {
  const width = useTransform(index, (v) => {
    return (v <= 0.5 ? (1 + v) * 100 : (2 - v) * 100) + "%";
  });

  return (
    <motion.div className="absolute h-full oveflow-clip" style={{ width }}>
      <InteractiveMediaFromCMS
        location="page-artworks"
        className="absolute h-full aspect-video left-0"
        depth={-50}
      />
    </motion.div>
  );
}

function ArtworksRight({ index }: LRProps) {
  // const [filter, setFilter] = useState<ArtworkFilter>("all");

  const width = useTransform(index, (v) => {
    return (v <= 0.5 ? (1 + v) * 100 : (2 - v) * 100) + "%";
  });

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className="absolute flex h-full w-full flex-col p-2 overflow-scroll right-0"
      style={{ width }}
    >
      {/* Header */}
      {/* <motion.div
        variants={staggerItemVariants}
        className="mb-4 flex items-center justify-between"
      >
        Filters
        <div className="flex gap-1 rounded-lg bg-white/5 p-1">
          {filters.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={cn(
                "rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                filter === value
                  ? "bg-white/20 text-white"
                  : "text-white/60 hover:text-white",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </motion.div> */}

      {/* Gallery */}
      <MasonryGallery filter={"all"} />
    </motion.div>
  );
}

export const ArtworksPage: PageContent = {
  Left: ArtworksLeft,
  Right: ArtworksRight,
};
