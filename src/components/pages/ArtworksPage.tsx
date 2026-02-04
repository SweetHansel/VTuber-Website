"use client";

import { MasonryGallery } from "@/components/display/MasonryGallery";
import {
  ExpandingPage,
  type LRProps,
} from "@/components/layout/BookLayout";
import { InteractiveMediaFromCMS } from "@/components/media";
import { useMotionValueState } from "@/hooks/useMotionValueState";

function ArtworksLeft({ index }: Readonly<LRProps>) {
  return (
    <ExpandingPage
      index={index}
      min={100}
      max={200}
      className="absolute h-full oveflow-clip mask-r-from-80% mask-r-to-95%"
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
  // Load data when visible
  const isVisible = currentPage > 0 && currentPage < 1;
  return (
    <ExpandingPage
      index={index}
      min={100}
      max={200}
      className="absolute h-full right-0 mask-l-from-80% mask-l-to-95%"
    >
      {/* Gallery */}
      <div className="absolute h-full p-4 aspect-11/9 right-0">
        <MasonryGallery filter={"all"} skip={!isVisible} />
      </div>
    </ExpandingPage>
  );
}

export const ArtworksPage = [ArtworksLeft, ArtworksRight]
