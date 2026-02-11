"use client";

import { MasonryGallery } from "@/components/display/MasonryGallery";
import {
  ExpandingPage,
  type LRProps,
} from "@/components/layout/BookLayout";
import { InteractiveMediaFromCMS } from "@/components/media";
import { useMotionValueState } from "@/hooks/useMotionValueState";
import { useArtworks } from "@/hooks/useCMS";
import { Loader2 } from "lucide-react";


function ArtworksLeft({ index }: Readonly<LRProps>) {
  return (
    <ExpandingPage
      index={index}
      min={100}
      max={200}
      className="absolute h-full oveflow-clip mask-r-from-75% mask-r-to-100%"
    >
      <InteractiveMediaFromCMS
        location="page-artworks"
        className="absolute h-full aspect-video left-0"
      />
    </ExpandingPage>
  );
}

function ArtworksRight({ index }: Readonly<LRProps>) {
  const currentPage = useMotionValueState(index);
  const isVisible = currentPage > 0 && currentPage < 1;

  const { data: artworks, loading } = useArtworks({ skip: !isVisible });

  return (
    <ExpandingPage
      index={index}
      min={100}
      max={200}
      className="absolute h-full right-0 mask-l-from-75% mask-l-to-100%"
    >
      {/* Gallery */}
      <div className="absolute h-full aspect-11/9 right-0">
        {loading || !artworks ? (
          <div className="flex h-full w-full items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-(--page-text)/40" />
          </div>
        ) : (
          <MasonryGallery artworks={artworks} filter="all" />
        )}
      </div>
    </ExpandingPage>
  );
}

export const ArtworksPage = [ArtworksLeft, ArtworksRight]
