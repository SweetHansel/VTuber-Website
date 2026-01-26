"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
import { staggerContainerVariants, staggerItemVariants } from "@/animations";
import { cn } from "@/lib/utils";
import type { PageContent } from "@/components/layout/BookLayout";
import { InteractiveMediaFromCMS } from "../layout/InteractiveMediaFromCMS";

type ArtworkFilter = "all" | "fanart" | "official" | "meme";

const filters: { label: string; value: ArtworkFilter }[] = [
  { label: "All", value: "all" },
  { label: "Fan Art", value: "fanart" },
  { label: "Official", value: "official" },
];

function ArtworksLeft() {
  return (
    <div className="absolute h-full w-full">
      <InteractiveMediaFromCMS
        location="page-artworks"
        className="absolute h-full w-full"
        depth={-50}
      />
    </div>
  );
}

function ArtworksRight({isActive}) {
  const [filter, setFilter] = useState<ArtworkFilter>("all");

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className={cn("absolute flex h-full w-full flex-col p-6",
        isActive? "overflow-visible" : "overflow-hidden"
      )}
    >
      {/* Header */}
      <motion.div
        variants={staggerItemVariants}
        className="mb-4 flex items-center justify-between"
      >
        {/* Filters */}
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
      </motion.div>

      {/* Gallery */}
      <MasonryGallery filter={filter} />
    </motion.div>
  );
}

export const ArtworksPage: PageContent = {
  Left: ArtworksLeft,
  Right: ArtworksRight,
};
