"use client";

import { SongGrid } from "@/components/display/SongGrid";
import { InteractiveMediaFromCMS } from "@/components/media";
import { ExpandingPage, type LRProps } from "@/components/layout/BookLayout";
import { useMotionValueState } from "@/hooks/useMotionValueState";
import { useMusicTracks } from "@/hooks/useCMS";
import { ScrollContainer } from "../layout";
import { Loader2 } from "lucide-react";

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
      className="absolute h-full right-0 overflow-clip pointer-events-none mask-l-from-75% mask-l-to-100%"
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
  const isVisible = currentPage > 0 && currentPage < 1;

  const { data: tracks, loading } = useMusicTracks({ skip: !isVisible });

  if (loading || !tracks) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--page-text)/40" />
      </div>
    );
  }

  return (
    <div className="flex h-full w-full p-4 justify-center items-center">
      <div className="flex max-w-2xl max-h-[70vh] h-full flex-col  gap-4 overflow-hidden">
        <div className="px-4 py-3 rounded-xl bg-(--page-surface)/5">
          <h1 className="text-3xl font-bold text-(--page-text)">Cover</h1>
        </div>
        <ScrollContainer className="flex-1 rounded-xl min-h-0 overflow-y-scroll bg-(--page-surface)/5 p-4 scrollbar-thin scrollbar-track-(--page-surface)/5 scrollbar-thumb-(--page-surface)/20 pointer-events-auto">
          <SongGrid tracks={tracks} filter={filters[1].value} />
        </ScrollContainer>
        <div className="px-4 py-3 rounded-xl bg-(--page-surface)/5">
          <h1 className="text-3xl font-bold text-(--page-text)">Originals</h1>
        </div>
        <ScrollContainer className="flex-1 rounded-xl min-h-0 overflow-y-scroll bg-(--page-surface)/5 p-4 scrollbar-thin scrollbar-track-(--page-surface)/5 scrollbar-thumb-(--page-surface)/20">
          <SongGrid tracks={tracks} filter={filters[2].value} />
        </ScrollContainer>
      </div>
    </div>
  );
}

export const DiscographyPage = [DiscographyLeft, DiscographyRight];
