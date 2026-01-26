"use client";

import { useMemo, useState, useCallback } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2, ExternalLink } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useArtworks, type Artwork as CMSArtwork } from "@/hooks/useCMS";
import { cn } from "@/lib/utils";

interface Artwork {
  id: string;
  title?: string;
  image: string;
  artworkType: "fanart" | "official" | "meme" | "commissioned" | "other";
  artistName?: string;
  sourceUrl?: string;
  isFeatured?: boolean;
  aspectRatio: number | null; // width / height, null if unknown
}

function transformArtwork(art: CMSArtwork): Artwork {
  const artistCredit = art.credits?.find(
    (c) => c.role === "artist" || c.role === "illustrator",
  );
  const artistName = artistCredit?.person?.name || artistCredit?.name;

  // Calculate aspect ratio from image dimensions if available
  const width = art.image?.width;
  const height = art.image?.height;
  const aspectRatio = width && height ? width / height : null;

  return {
    id: art.id,
    title: art.title,
    image: art.image?.url || "/placeholder-art-1.jpg",
    artworkType: art.artworkType === "other" ? "other" : art.artworkType,
    artistName: artistName ? `@${artistName.replace("@", "")}` : undefined,
    sourceUrl: art.sourceUrl,
    isFeatured: art.isFeatured,
    aspectRatio,
  };
}

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
    // Get aspect ratio: CMS value > detected value > default (3/4 portrait)
    const ratio = artwork.aspectRatio ?? aspectRatios[artwork.id] ?? 0.75;

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
  filter?: "all" | "fanart" | "official" | "meme";
}

export function MasonryGallery({ filter = "all" }: MasonryGalleryProps) {
  const openModal = useModalStore((state) => state.openModal);
  const { data: cmsArtworks, loading, error } = useArtworks(filter);

  // Track detected aspect ratios for images without CMS dimensions
  const [detectedRatios, setDetectedRatios] = useState<Record<string, number>>({});

  const handleImageLoad = useCallback((id: string, naturalWidth: number, naturalHeight: number) => {
    if (naturalWidth && naturalHeight) {
      setDetectedRatios((prev) => ({
        ...prev,
        [id]: naturalWidth / naturalHeight,
      }));
    }
  }, []);

  const artworks: Artwork[] = useMemo(
    () =>
      cmsArtworks && cmsArtworks.length > 0
        ? cmsArtworks.map(transformArtwork)
        : [],
    [cmsArtworks],
  );

  const filteredArtworks = useMemo(
    () =>
      cmsArtworks && cmsArtworks.length > 0
        ? artworks
        : artworks.filter((art) => {
            if (filter === "all") return true;
            return art.artworkType === filter;
          }),
    [cmsArtworks, artworks, filter],
  );

  // Compute rows - using fixed container width estimate (will be responsive via CSS)
  // Target row height of 120px, 8px gap
  const rows = useMemo(
    () => computeRows(filteredArtworks, detectedRatios, 800, 120, 8),
    [filteredArtworks, detectedRatios],
  );

  const handleClick = (artwork: Artwork) => {
    openModal(
      "artwork",
      artwork.id,
      artwork as unknown as Record<string, unknown>,
    );
  };

  if (loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-white/40" />
      </div>
    );
  }

  if (error) {
    console.warn("Failed to fetch artworks, using fallback data:", error);
  }

  const ROW_HEIGHT = 120;

  return (
    <div className="flex flex-col gap-2">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row-reverse justify-start gap-2">
          {row.map(({ artwork, ratio }, itemIndex) => (
            <motion.div
              key={artwork.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (rowIndex * row.length + itemIndex) * 0.02 }}
              className="relative flex-shrink-0 cursor-pointer overflow-y-scroll rounded-lg group"
              style={{
                height: ROW_HEIGHT,
                aspectRatio: ratio,
              }}
              onClick={() => handleClick(artwork)}
            >
              <Image
                src={artwork.image}
                alt={artwork.title || "Artwork"}
                fill
                className={cn(
                  "object-cover transition-transform duration-300 group-hover:scale-105",
                  artwork.isFeatured && "ring-2 ring-yellow-500/50",
                )}
                onLoad={(e) => {
                  // Detect aspect ratio if not provided by CMS
                  if (!artwork.aspectRatio) {
                    const img = e.currentTarget as HTMLImageElement;
                    handleImageLoad(artwork.id, img.naturalWidth, img.naturalHeight);
                  }
                }}
              />

              {/* Overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute bottom-0 left-0 right-0 p-2">
                  {artwork.title && (
                    <h3 className="mb-0.5 text-xs font-medium text-white line-clamp-1">
                      {artwork.title}
                    </h3>
                  )}
                  {artwork.artistName && (
                    <p className="text-[10px] text-white/70 line-clamp-1">
                      {artwork.artistName}
                    </p>
                  )}
                </div>

                {artwork.sourceUrl && (
                  <a
                    href={artwork.sourceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="absolute right-1 top-1 rounded-full bg-black/50 p-1.5 text-white/80 transition-colors hover:bg-black/70 hover:text-white"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              {/* Type badge */}
              <div className="absolute left-1 top-1">
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-medium capitalize",
                    artwork.artworkType === "official"
                      ? "bg-blue-500/80 text-white"
                      : artwork.artworkType === "fanart"
                        ? "bg-cyan-500/80 text-white"
                        : "bg-gray-500/80 text-white",
                  )}
                >
                  {artwork.artworkType}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      ))}

      {filteredArtworks.length === 0 && (
        <div className="w-full py-12 text-center text-white/40">
          No artworks found
        </div>
      )}
    </div>
  );
}
