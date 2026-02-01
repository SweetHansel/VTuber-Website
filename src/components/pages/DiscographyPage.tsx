"use client";

import { useState } from "react";
import { motion, useTransform } from "framer-motion";
import { SongGrid } from "@/components/discography/SongGrid";
import { InteractiveMediaFromCMS } from "@/components/layout/InteractiveMediaFromCMS";
import { staggerContainerVariants, staggerItemVariants } from "@/animations";
import { cn } from "@/lib/utils";
import type { LRProps, PageContent } from "@/components/layout/BookLayout";

type MusicFilter = "all" | "covers" | "originals";

const filters: { label: string; value: MusicFilter }[] = [
  { label: "All", value: "all" },
  { label: "Covers", value: "covers" },
  { label: "Originals", value: "originals" },
];

function DiscographyRight({ index }: LRProps) {
  const width = useTransform(index, (v) => {
    return (v <= 0.5 ? (1 + v * 2) * 100 : (3 - v * 2) * 100) + "%";
  });
  return (
    <motion.div className="absolute h-full w-full" style={{ width }}>
      <InteractiveMediaFromCMS
        location="page-discography"
        className="absolute h-full w-full"
        depth={-40}
      />
    </motion.div>
  );
}

function DiscographyLeft() {
  const [filter, setFilter] = useState<MusicFilter>("all");

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className="flex h-full w-full flex-col p-6"
    >
      {/* Header */}
      <motion.div
        variants={staggerItemVariants}
        className="mb-4 flex items-center justify-between"
      >
        <h1 className="text-2xl font-bold text-white">Discography</h1>

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

      {/* Song Grid */}
      <motion.div
        variants={staggerItemVariants}
        className="flex-1 overflow-y-auto"
      >
        <SongGrid filter={filter} />
      </motion.div>
    </motion.div>
  );
}

export const DiscographyPage: PageContent = {
  Left: DiscographyLeft,
  Right: DiscographyRight,
};
