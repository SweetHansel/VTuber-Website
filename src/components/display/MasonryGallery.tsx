"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useModalStore } from "@/stores/modalStore";
import { type Artwork, getMedia } from "@/hooks/useCMS";
import { ARTWORK_TYPE_COLORS, type ArtworkFilter, type ArtworkType } from "@/constants/artworks";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui";
import { ScrollContainer } from "../layout";

function getAspectRatio(artwork: Artwork): number {
  const media = getMedia(artwork.image);
  if (media?.width && media?.height) return media.width / media.height;
  return 0.75;
}

// Group artworks into rows based on container width
function computeRows(
  artworks: Artwork[],
  containerWidth: number,
  targetRowHeight: number,
  gap: number,
): { artwork: Artwork; ratio: number }[][] {
  const rows: { artwork: Artwork; ratio: number }[][] = [];
  let currentRow: { artwork: Artwork; ratio: number }[] = [];
  let currentRowWidth = 0;

  for (const artwork of artworks) {
    const ratio = getAspectRatio(artwork);
    const imageWidth = targetRowHeight * ratio;
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

  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    let settleId: ReturnType<typeof setTimeout>;

    const measure = () => {
      setContainerWidth(el.clientWidth);
      setContainerHeight(el.clientHeight);
    };

    const observer = new ResizeObserver(() => {
      measure();
      // Re-read after animations settle in case ResizeObserver
      // coalesced mid-animation and missed the final state
      clearTimeout(settleId);
      settleId = setTimeout(measure, 300);
    });

    observer.observe(el);
    return () => {
      observer.disconnect();
      clearTimeout(settleId);
    };
  }, []);

  const rowHeight = Math.max(containerHeight * 0.3, 80);

  const filteredArtworks = useMemo(() => {
    if (filter === "all") return cmsArtworks;
    return cmsArtworks.filter((art) => art.artworkType === filter);
  }, [cmsArtworks, filter]);

  const rows = useMemo(
    () => computeRows(filteredArtworks, containerWidth, rowHeight, 8),
    [filteredArtworks, containerWidth, rowHeight],
  );

  return (
    <ScrollContainer
      ref={containerRef}
      className="relative w-full h-full p-4 flex flex-col  gap-4 overflow-scroll scrollbar-thin"
    >
      {rows.map((row, rowIndex) => (
        <div
          key={"row_" + rowIndex}
          className="flex flex-row-reverse justify-start  gap-4 "
        >
          {row.map(({ artwork, ratio }) => {
            const imageUrl = getMedia(artwork.image)?.url;

            if (!imageUrl) return null;

            return (
              <div
                key={artwork.id}
                className="relative shrink-0 cursor-pointer overflow-hidden group"
                style={{ height: rowHeight, aspectRatio: ratio }}
                onClick={() => openModal("artwork", artwork)}
              >
                <Image
                  src={imageUrl}
                  alt={artwork.title || "Artwork"}
                  fill
                  className={cn(
                    "object-cover transition-transform duration-300 group-hover:scale-105",
                    artwork.isFeatured && "ring-2 ring-yellow-500/50",
                  )}
                />

                <Badge
                  label={artwork.artworkType}
                  colorClass={ARTWORK_TYPE_COLORS[artwork.artworkType as ArtworkType]}
                  className="absolute top-2 left-2 z-10"
                />
              </div>
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
