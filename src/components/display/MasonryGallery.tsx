"use client";

import { useMemo, useState, useCallback, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { Loader2, ExternalLink } from "lucide-react";
import { useModalStore } from "@/stores/modalStore";
import { useArtworks, type Artwork as CMSArtwork, getMedia, getPerson, nullToUndefined } from "@/hooks/useCMS";
import { ARTWORK_TYPE_COLORS, type ArtworkType, type ArtworkFilter } from "@/constants/artworks";
import { cn } from "@/lib/utils";

interface Artwork {
  id: string;
  title?: string;
  image: string;
  artworkType: ArtworkType;
  artistName?: string;
  sourceUrl?: string;
  isFeatured?: boolean;
  aspectRatio: number | null; // width / height, null if unknown
}

function transformArtwork(art: CMSArtwork): Artwork {
  const artistCredit = art.credits?.find(
    (c) => c.role === "artist" || c.role === "illustrator",
  );
  const artistPerson = getPerson(artistCredit?.person);
  const artistName = artistPerson?.name || artistCredit?.name;

  // Get media object from union type
  const imageMedia = getMedia(art.image);

  // Calculate aspect ratio from image dimensions if available
  const width = imageMedia?.width;
  const height = imageMedia?.height;
  const aspectRatio = width && height ? width / height : null;

  return {
    id: String(art.id),
    title: nullToUndefined(art.title),
    image: imageMedia?.url || "/placeholder-art-1.jpg",
    artworkType: art.artworkType === "other" ? "other" : art.artworkType,
    artistName: artistName ? `@${artistName.replace("@", "")}` : undefined,
    sourceUrl: nullToUndefined(art.sourceUrl),
    isFeatured: nullToUndefined(art.isFeatured),
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
  filter?: ArtworkFilter;
  skip?: boolean;
}

export function MasonryGallery({ filter = "all", skip = false }: MasonryGalleryProps) {
  const openModal = useModalStore((state) => state.openModal);
  const { data: cmsArtworks, loading, error } = useArtworks(filter, { skip });

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
  }, [loading]);

  // Row height is 20% of container height
  const rowHeight = Math.max(containerHeight * 0.3, 80); // min 80px

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

  // Compute rows based on actual container dimensions
  // Row height is 20% of container height, 8px gap
  const rows = useMemo(
    () => computeRows(filteredArtworks, detectedRatios, containerWidth, rowHeight, 8),
    [filteredArtworks, detectedRatios, containerWidth, rowHeight],
  );

  const handleClick = (artwork: Artwork) => {
    openModal(
      "artwork",
      artwork.id,
      artwork as unknown as Record<string, unknown>,
    );
  };

  if (skip || loading) {
    return (
      <div className="flex h-40 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-(--page-text)/40" />
      </div>
    );
  }

  if (error) {
    console.warn("Failed to fetch artworks, using fallback data:", error);
  }

  return (
    <div ref={containerRef} className="relative w-full h-full flex flex-col gap-2 overflow-scroll scrollbar-thin">
      {rows.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-row-reverse justify-start gap-2">
          {row.map(({ artwork, ratio }, itemIndex) => (
            <motion.div
              key={artwork.id}
              transition={{ delay: (rowIndex * row.length + itemIndex) * 0.02 }}
              className="relative shrink-0 cursor-pointer overflow-hidden group"
              style={{
                height: rowHeight,
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
              <div className="absolute inset-0 bg-linear-to-t from-black/80 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100">
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
                    ARTWORK_TYPE_COLORS[artwork.artworkType],
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
        <div className="w-full py-12 text-center text-(--page-text)/40">
          No artworks found
        </div>
      )}
    </div>
  );
}
