"use client";

// import { useState } from "react";
import { motion, useTransform } from "framer-motion";
import { SongGrid } from "@/components/discography/SongGrid";
import { InteractiveMediaFromCMS } from "@/components/layout/InteractiveMediaFromCMS";
import { staggerContainerVariants, staggerItemVariants } from "@/animations";
// import { cn } from "@/lib/utils";
import type { LRProps, PageContent } from "@/components/layout/BookLayout";

type MusicFilter = "all" | "covers" | "originals";

const filters: { label: string; value: MusicFilter }[] = [
  { label: "All", value: "all" },
  { label: "Covers", value: "covers" },
  { label: "Originals", value: "originals" },
];

function DiscographyRight({ index }: Readonly<LRProps>) {
  const width = useTransform(index, (v) => {
    return (v <= 0.5 ? (1 + v * 2) * 100 : (3 - v * 2) * 100) + "%";
  });
  return (
    <motion.div
      className="absolute h-full right-0 overflow-clip pointer-events-none"
      style={{ width }}
    >
      <InteractiveMediaFromCMS
        location="page-discography"
        className="absolute h-full aspect-video right-0"
        depth={-40}
      />
    </motion.div>
  );
}

function DiscographyLeft() {
  // const [filter, setFilter] = useState<MusicFilter>("all");

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className="flex h-full w-full flex-col p-4 gap-2"
    >
      <div className="p-2 bg-(--page-surface)/5">
        <h1 className="text-base text-(--page-text)">Cover</h1>
      </div>
      <motion.div
        variants={staggerItemVariants}
        className="flex-1 overflow-y-auto bg-(--page-surface)/5 p-2"
      >
        <SongGrid filter={filters[1].value} />
      </motion.div>
      <div className="p-2 bg-(--page-surface)/5">
        <h1 className="text-base text-(--page-text)">Originals</h1>
      </div>
      <motion.div
        variants={staggerItemVariants}
        className="flex-1 overflow-y-auto bg-(--page-surface)/5 p-2"
      >
        <SongGrid filter={filters[2].value} />
      </motion.div>
    </motion.div>
  );
}

export const DiscographyPage: PageContent = {
  Left: DiscographyLeft,
  Right: DiscographyRight,
};
