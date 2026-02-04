"use client";

import { motion, useTransform } from "framer-motion";
import { MasonryGallery } from "@/components/display/MasonryGallery";
import {
  mapToFlatOnly,
  type LRProps,
  type PageContent,
} from "@/components/layout/BookLayout";
import { InteractiveMediaFromCMS } from "@/components/media";
import { useMotionValueState } from "@/hooks/useMotionValueState";

function ArtworksLeft({ index }: Readonly<LRProps>) {
  const width = useTransform(index, (x) => {
    const v = mapToFlatOnly(x);
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
      />
    </motion.div>
  );
}

function ArtworksRight({ index }: Readonly<LRProps>) {
  const currentPage = useMotionValueState(index);
  // Load data when visible
  const isVisible = currentPage > 0 && currentPage < 1;

  const width = useTransform(index, (x) => {
    const v = mapToFlatOnly(x);
    return (v <= 0.5 ? (1 + v) * 100 : (2 - v) * 100) + "%";
  });

  return (
    <motion.div
      className="absolute h-full w-full right-0 mask-l-from-80% mask-l-to-95%"
      style={{ width }}
    >
      {/* Gallery */}
      <div className="absolute h-full p-4 aspect-11/9 right-0">
        <MasonryGallery filter={"all"} skip={!isVisible} />
      </div>
    </motion.div>
  );
}

export const ArtworksPage: PageContent = {
  Left: ArtworksLeft,
  Right: ArtworksRight,
};
