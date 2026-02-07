"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useModalStore } from "@/stores/modalStore";
import { type Artwork, getMedia } from "@/hooks/useCMS";
import { ARTWORK_TYPE_COLORS, type ArtworkFilter } from "@/constants/artworks";
import { cn } from "@/lib/utils";
import { ScrollContainer } from "../layout";

// Group artworks into rows based on container width (no justification)
function computeRows(
  artworks: Artwork[],
  aspectRatios: Record<string, number>,
  containerWidth: number,
  targetRowHeight: number,
  gap: number,
): { artwork: Artwork; ratio: number }[][] {
  const rows: { artwork: Artwork; ratio: number }[][] = [];
  let currentRow: { artwork: Artwork; ratio: number }[] = [];
  let currentRowWidth = 0;

  for (const artwork of artworks) {
    // Get aspect ratio from detected ratios or default (3/4 portrait)
    const ratio = aspectRatios[String(artwork.id)] ?? 0.75;

    // Width this image would have at target height
    const imageWidth = targetRowHeight * ratio;

    // Check if adding this image would exceed container width
    const totalWidth =
      currentRowWidth + imageWidth + (currentRow.length > 0 ? gap : 0);

    if (totalWidth > containerWidth && currentRow.length > 0) {
      rows.push(currentRow);
      currentRow = [];
      currentRowWidth = 0;
    }

    currentRow.push({ artwork, ratio });
    currentRowWidth += imageWidth + (currentRow.length > 1 ? gap : 0);
  }

  // Add last row
  if (currentRow.length > 0) {
    rows.push(currentRow);
  }

  return rows;
}

interface MasonryGalleryProps {
  artworks: Artwork[];
  filter?: ArtworkFilter;
}

export function MasonryGallery({
  artworks: cmsArtworks,
  filter = "all",
}: Readonly<MasonryGalleryProps>) {
  const openModal = useModalStore((state) => state.openModal);

  // Track container dimensions for responsive masonry
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(800);
  const [containerHeight, setContainerHeight] = useState(600);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      const rect = entries[0]?.contentRect;
      if (rect) {
        setContainerWidth(rect.width);
        setContainerHeight(rect.height);
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Row height is 30% of container height
  const rowHeight = Math.max(containerHeight * 0.3, 80); // min 80px

  // Track detected aspect ratios for images
  const [detectedRatios, setDetectedRatios] = useState<Record<string, number>>(
    {},
  );

  const handleImageLoad = useCallback(
    (id: string, naturalWidth: number, naturalHeight: number) => {
      if (naturalWidth && naturalHeight) {
        setDetectedRatios((prev) => ({
          ...prev,
          [id]: naturalWidth / naturalHeight,
        }));
      }
    },
    [],
  );

  // Client-side filtering
  const filteredArtworks = useMemo(() => {
    if (filter === "all") return cmsArtworks;
    return cmsArtworks.filter((art) => art.artworkType === filter);
  }, [cmsArtworks, filter]);

  // Compute rows based on actual container dimensions
  const rows = useMemo(
    () =>
      computeRows(
        filteredArtworks,
        detectedRatios,
        containerWidth,
        rowHeight,
        8,
      ),
    [filteredArtworks, detectedRatios, containerWidth, rowHeight],
  );

  const handleClick = (artwork: Artwork) => {
    openModal("artwork", artwork);
  };

  return (
    <ScrollContainer
      ref={containerRef}
      className="relative w-full h-full flex flex-col gap-2 overflow-scroll scrollbar-thin"
    >
      {rows.map((row, rowIndex) => (
        <div
          key={"row_" + rowIndex}
          className="flex flex-row-reverse justify-start gap-2"
        >
          {row.map(({ artwork, ratio }, itemIndex) => {
            const imageUrl = getMedia(artwork.image)?.url;

            if (!imageUrl) return null;

            return (
              <motion.div
                key={artwork.id}
                transition={{
                  delay: (rowIndex * row.length + itemIndex) * 0.02,
                }}
                className="relative shrink-0 cursor-pointer overflow-hidden group"
                style={{
                  height: rowHeight,
                  aspectRatio: ratio,
                }}
                onClick={() => handleClick(artwork)}
              >
                <Image
                  src={imageUrl}
                  alt={artwork.title || "Artwork"}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-300 group-hover:scale-105",
                    artwork.isFeatured && "ring-2 ring-yellow-500/50",
                  )}
                  onLoad={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    handleImageLoad(
                      String(artwork.id),
                      img.naturalWidth,
                      img.naturalHeight,
                    );
                  }}
                />

                {/* Type badge */}
                <div className="absolute left-1 top-1">
                  <span
                    className={cn(
                      "rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
                      ARTWORK_TYPE_COLORS[artwork.artworkType],
                    )}
                  >
                    {artwork.artworkType}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      ))}

      {filteredArtworks.length === 0 && (
        <div className="w-full py-12 text-center text-(--page-text)/40">
          No artworks found
        </div>
      )}
    </ScrollContainer>
  );
}
