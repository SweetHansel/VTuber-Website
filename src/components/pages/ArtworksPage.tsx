"use client";

import { motion, useTransform } from "framer-motion";
import { MasonryGallery } from "@/components/gallery/MasonryGallery";
import type { LRProps, PageContent } from "@/components/layout/BookLayout";
import { InteractiveMediaFromCMS } from "../layout/InteractiveMediaFromCMS";
import { useMotionValueState } from "@/hooks/useMotionValueState";

function ArtworksLeft({ index }: LRProps) {
  const width = useTransform(index, (v) => {
    return (v <= 0.5 ? (1 + v) * 100 : (2 - v) * 100) + "%";
  });

  return (
    <motion.div
      className="absolute h-full oveflow-clip mask-r-from-80% mask-r-to-95%"
      style={{ width }}
    >
      <InteractiveMediaFromCMS
        location="page-artworks"
        className="absolute h-full aspect-video left-0"
        depth={-50}
      />
    </motion.div>
  );
}

function ArtworksRight({ index }: LRProps) {
  const currentPage = useMotionValueState(index);
  // Load data when within 1 page of visibility (artworks is page 1, so check around 0.5)
  const isNearVisible = currentPage > 0;

  const width = useTransform(index, (v) => {
    return (v <= 0.5 ? (1 + v) * 100 : (2 - v) * 100) + "%";
  });

  return (
    <motion.div
      className="absolute h-full w-full p-2 right-0 mask-l-from-80% mask-l-to-95%"
      style={{ width }}
    >
      {/* Gallery */}
      <div className="absolute h-full p-6 aspect-11/9 right-0">
        <MasonryGallery filter={"all"} skip={!isNearVisible} />
      </div>
    </motion.div>
  );
}

export const ArtworksPage: PageContent = {
  Left: ArtworksLeft,
  Right: ArtworksRight,
};
