"use client";

import { SongGrid } from "@/components/discography/SongGrid";
import { InteractiveMediaFromCMS } from "@/components/media";
import {
  ExpandingPage,
  type LRProps,
} from "@/components/layout/BookLayout";
import { useMotionValueState } from "@/hooks/useMotionValueState";

type MusicFilter = "all" | "covers" | "originals";

const filters: { label: string; value: MusicFilter }[] = [
  { label: "All", value: "all" },
  { label: "Covers", value: "covers" },
  { label: "Originals", value: "originals" },
];

function DiscographyRight({ index }: Readonly<LRProps>) {
  return (
    <ExpandingPage
      index={index}
      min={100}
      max={200}
      className="absolute h-full right-0 overflow-clip pointer-events-none mask-l-from-80% mask-l-to-95%"
    >
      <InteractiveMediaFromCMS
        location="page-discography"
        className="absolute h-full aspect-video right-0"
      />
    </ExpandingPage>
  );
}

function DiscographyLeft({ index }: Readonly<LRProps>) {
  const currentPage = useMotionValueState(index);
  // Load data when visible
  const isVisible = currentPage > 0 && currentPage < 1;

  return (
    <div className="flex h-full w-full flex-col p-4 gap-3">
      <div className="px-2 py-1 bg-(--page-surface)/5">
        <h1 className="text-base text-(--page-text)">Cover</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-(--page-surface)/5 p-3 scrollbar-thin scrollbar-track-(--page-surface)/5 scrollbar-thumb-(--page-surface)/20">
        <SongGrid filter={filters[1].value} skip={!isVisible} />
      </div>
      <div className="px-2 py-1 bg-(--page-surface)/5">
        <h1 className="text-base text-(--page-text)">Originals</h1>
      </div>
      <div className="flex-1 overflow-y-auto bg-(--page-surface)/5 p-3 scrollbar-thin scrollbar-track-(--page-surface)/5 scrollbar-thumb-(--page-surface)/20">
        <SongGrid filter={filters[2].value} skip={!isVisible} />
      </div>
    </div>
  );
}

export const DiscographyPage = [DiscographyLeft, DiscographyRight]
