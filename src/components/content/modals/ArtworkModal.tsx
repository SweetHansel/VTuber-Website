"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import { PeopleDisplay } from "@/components/people";
import { getMedia, getPerson, getTag, type Tag } from "@/hooks/useCMS";
import { getPersonFromCredit, type Credit } from "@/lib/people";
import type { Artwork, Person } from "@/payload-types";

interface ArtworkModalProps {
  data: Artwork;
}

export function ArtworkModalContent({
  data,
}: Readonly<ArtworkModalProps>) {
  const image = getMedia(data.image)?.url || "/placeholder-art.jpg";

  const credits: Credit[] = (data.credits ?? []).map((c) => ({
    role: c.role,
    person: c.person as Credit['person'],
    name: c.name ?? undefined,
    id: c.id ?? undefined,
  }));

  const featuredPeople: Person[] = (data.featuredPeople ?? [])
    .map((p) => getPerson(p))
    .filter((p): p is Person => !!p);

  const tags = (data.tags ?? []).map(getTag).filter((t): t is Tag => !!t);

  // Get artist name from credits
  const artistCredit = credits.find(c =>
    c.role?.toLowerCase() === 'artist' || c.role?.toLowerCase() === 'illustrator'
  );
  const artistPerson = artistCredit ? getPersonFromCredit(artistCredit) : undefined;
  const artistName = artistPerson?.name ?? artistCredit?.name;

  return (
    <div>
      {/* Image */}
      <div className="relative -mx-6 -mt-6 mb-6 overflow-hidden rounded-t-2xl">
        <div className="relative aspect-4/3 w-full">
          <Image
            src={image}
            alt={data.title || "Artwork"}
            fill
            className="object-contain bg-black/50"
          />
        </div>
      </div>

      {/* Type badge */}
      <span
        className={cn(
          "mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize",
          data.artworkType === "official"
            ? "bg-blue-500/20 text-blue-300"
            : data.artworkType === "fanart"
              ? "bg-cyan-500/20 text-cyan-300"
              : data.artworkType === "commissioned"
                ? "bg-purple-500/20 text-purple-300"
                : "bg-gray-500/20 text-gray-300",
        )}
      >
        {data.artworkType}
      </span>

      {/* Title */}
      {data.title && (
        <h2 className="mb-2 text-2xl font-bold text-(--modal-text)">{data.title}</h2>
      )}

      {/* Artist (simple display when no full credits) */}
      {artistName && credits.length === 0 && (
        <p className="mb-4 text-(--modal-text)/60">by {artistName}</p>
      )}

      {/* Credits */}
      {credits.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm text-(--modal-text)/40">Credits</p>
          <PeopleDisplay credits={credits} />
        </div>
      )}

      {/* Featured People */}
      {featuredPeople.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-sm text-(--modal-text)/40">Featured</p>
          <PeopleDisplay people={featuredPeople} size="md" />
        </div>
      )}

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: tag.color ? `${tag.color}20` : 'var(--modal-surface)',
                  color: tag.color || 'var(--modal-text)',
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Source link */}
      {data.sourceUrl && (
        <a
          href={data.sourceUrl}
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
