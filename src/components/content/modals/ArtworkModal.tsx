"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";

interface ArtworkModalProps {
  data: Record<string, unknown>;
}

export function ArtworkModalContent({
  data,
}: Readonly<ArtworkModalProps>) {
  const title = data.title ? String(data.title) : undefined;
  const image = String(data.image || "/placeholder-art.jpg");
  const artworkType = String(data.artworkType || "fanart");
  const artistName = data.artistName ? String(data.artistName) : undefined;
  const sourceUrl = data.sourceUrl ? String(data.sourceUrl) : undefined;

  return (
    <div>
      {/* Image */}
      <div className="relative -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl">
        <div className="relative aspect-4/3 w-full">
          <Image
            src={image}
            alt={title || "Artwork"}
            fill
            className="object-contain bg-black/50"
          />
        </div>
      </div>

      {/* Type badge */}
      <span
        className={cn(
          "mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize",
          artworkType === "official"
            ? "bg-blue-500/20 text-blue-300"
            : artworkType === "fanart"
              ? "bg-cyan-500/20 text-cyan-300"
              : artworkType === "commissioned"
                ? "bg-purple-500/20 text-purple-300"
                : "bg-gray-500/20 text-gray-300",
        )}
      >
        {artworkType}
      </span>

      {/* Title */}
      {title && (
        <h2 className="mb-2 text-2xl font-bold text-(--modal-text)">{title}</h2>
      )}

      {/* Artist */}
      {artistName && (
        <p className="mb-4 text-(--modal-text)/60">by {artistName}</p>
      )}

      {/* Source link */}
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-(--modal-surface)/10 px-4 py-2 text-sm text-(--modal-text)/70 transition-colors hover:bg-(--modal-surface)/20 hover:text-(--modal-text)"
        >
          View Original
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
