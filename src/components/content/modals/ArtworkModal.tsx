"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { PeopleDisplay, Tags, Badge } from "@/components/ui";
import { ARTWORK_TYPE_COLORS, type ArtworkType } from "@/constants/artworks";
import { getMedia, getPerson, getTag, type Tag as CMSTag } from "@/hooks/useCMS";
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

  const tags = (data.tags ?? []).map(getTag).filter((t): t is CMSTag => !!t);

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
      <Badge
        label={data.artworkType}
        colorClass={ARTWORK_TYPE_COLORS[data.artworkType as ArtworkType]}
        size="md"
        className="mb-3"
      />

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
          <p className="mb-2 text-base text-(--modal-text)/40">Credits</p>
          <PeopleDisplay credits={credits} />
        </div>
      )}

      {/* Featured People */}
      {featuredPeople.length > 0 && (
        <div className="mb-4">
          <p className="mb-2 text-base text-(--modal-text)/40">Featured</p>
          <PeopleDisplay people={featuredPeople} size="md" />
        </div>
      )}

      {/* Tags */}
      <Tags tags={tags} className="mb-4" />

      {/* Source link */}
      {data.sourceUrl && (
        <a
          href={data.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center  gap-4 rounded-full bg-(--modal-surface)/10 px-4 py-2 text-base text-(--modal-text)/70 transition-colors hover:bg-(--modal-surface)/20 hover:text-(--modal-text)"
        >
          View Original
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
    </div>
  );
}
