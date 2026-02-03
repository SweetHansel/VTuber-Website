"use client";

import { motion, useTransform } from "framer-motion";
import { SongGrid } from "@/components/discography/SongGrid";
import { InteractiveMediaFromCMS } from "@/components/media";
import { mapToFlatOnly, type LRProps, type PageContent } from "@/components/layout/BookLayout";
import { useMotionValueState } from "@/hooks/useMotionValueState";

type MusicFilter = "all" | "covers" | "originals";

const filters: { label: string; value: MusicFilter }[] = [
  { label: "All", value: "all" },
  { label: "Covers", value: "covers" },
  { label: "Originals", value: "originals" },
];

function DiscographyRight({ index }: Readonly<LRProps>) {
  const width = useTransform(index, (x) => {
    const v = mapToFlatOnly(x);
    return (v <= 0.5 ? (1 + v * 2) * 100 : (3 - v * 2) * 100) + "%";
  });
  return (
    <motion.div
      className="absolute h-full right-0 overflow-clip pointer-events-none mask-l-from-80% mask-l-to-95%"
      style={{ width }}
    >
      <InteractiveMediaFromCMS
        location="page-discography"
        className="absolute h-full aspect-video right-0"
      />
    </motion.div>
  );
}

function DiscographyLeft({ index }: Readonly<LRProps>) {
  const currentPage = useMotionValueState(index);
  // Load data when within 1 page of visibility (discography is page 2, so check around 0.5)
  const isNearVisible = currentPage > 0;

  return (
    <div className="flex h-full w-full flex-col p-4 gap-3">
      <div className="px-2 py-1 bg-(--page-surface)/5">
        <h1 className="text-base text-(--page-text)">Cover</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-(--page-surface)/5 p-3 scrollbar-thin scrollbar-track-(--page-surface)/5 scrollbar-thumb-(--page-surface)/20">
        <SongGrid filter={filters[1].value} skip={!isNearVisible} />
      </div>
      <div className="px-2 py-1 bg-(--page-surface)/5">
        <h1 className="text-base text-(--page-text)">Originals</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-(--page-surface)/5 p-3 scrollbar-thin scrollbar-track-(--page-surface)/5 scrollbar-thumb-(--page-surface)/20">
        <SongGrid filter={filters[2].value} skip={!isNearVisible} />
      </div>
    </div>
  );
}

export const DiscographyPage: PageContent = {
  Left: DiscographyLeft,
  Right: DiscographyRight,
};
