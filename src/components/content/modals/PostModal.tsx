"use client";

import Image from "next/image";
import { useState } from "react";
import { Calendar, MapPin, ExternalLink, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import { POST_TYPE_COLORS, type PostType } from "@/constants/content";
import { RichTextRenderer } from "@/components/richtext/RichTextRenderer";
import { PeopleDisplay } from "@/components/people";
import { getMedia, getPerson, getTag, type Tag } from "@/hooks/useCMS";
import type { Post, Person } from "@/payload-types";
import type { Credit } from "@/lib/people";

interface PostModalProps {
  data: Post;
}

export function PostModalContent({ data }: Readonly<PostModalProps>) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const postType = (data.postType as PostType) || "general";
  const featuredImages = data.featuredImages ?? [];

  // Get current image
  const currentFeaturedImage = featuredImages[currentImageIndex];
  const currentMedia = currentFeaturedImage
    ? getMedia(currentFeaturedImage.image)
    : undefined;

  const tags = (data.tags ?? []).map(getTag).filter((t): t is Tag => !!t);

  const content = data.content as { root: { children: unknown[] } } | null | undefined;
  const hasRichContent = content?.root?.children && content.root.children.length > 0;

  const featuredPeople: Person[] = (data.featuredPeople ?? [])
    .map((p) => getPerson(p))
    .filter((p): p is Person => !!p);

  const credits: Credit[] = (data.credits ?? []).map((c) => ({
    role: c.role,
    person: c.person as Credit['person'],
    name: c.name ?? undefined,
    id: c.id ?? undefined,
  }));

  const displayDate = data.eventDate || data.publishedAt;

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) =>
      prev === 0 ? featuredImages.length - 1 : prev - 1
    );
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) =>
      prev === featuredImages.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div>
      {/* Image carousel */}
      {currentMedia?.url && (
        <div className="relative -mx-6 -mt-6 mb-6">
          <div className="relative aspect-video overflow-hidden rounded-t-2xl">
            <Image
              src={currentMedia.url}
              alt={currentFeaturedImage?.caption || data.title}
              fill
              className="object-cover"
            />
          </div>

          {/* Carousel controls */}
          {featuredImages.length > 1 && (
            <>
              <button
                onClick={handlePrevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                onClick={handleNextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
              >
                <ChevronRight className="h-5 w-5" />
              </button>

              {/* Dots indicator */}
              <div className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1.5">
                {featuredImages.map((_, idx) => (
                  <button
                    key={"dot_"+idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={cn(
                      "h-2 w-2 rounded-full transition-colors",
                      idx === currentImageIndex
                        ? "bg-white"
                        : "bg-white/50 hover:bg-white/70"
                    )}
                  />
                ))}
              </div>
            </>
          )}

          {/* Caption */}
          {currentFeaturedImage?.caption && (
            <p className="mt-2 px-6 text-center text-sm text-(--modal-text)/60">
              {currentFeaturedImage.caption}
            </p>
          )}
        </div>
      )}

      {/* Type badge */}
      <span
        className={cn(
          "mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize",
          POST_TYPE_COLORS[postType] || POST_TYPE_COLORS.general
        )}
      >
        {postType}
      </span>

      {/* Title */}
      <h2 className="mb-3 text-2xl font-bold text-(--modal-text)">{data.title}</h2>

      {/* Meta info */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-(--modal-text)/60">
        {displayDate && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(displayDate, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
        {data.location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {data.location}
          </span>
        )}
      </div>

      {/* Tags */}
      {tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag.id}
                className="rounded-full px-2.5 py-1 text-xs font-medium"
                style={{
                  backgroundColor: tag.color
                    ? `${tag.color}20`
                    : "var(--modal-surface)",
                  color: tag.color || "var(--modal-text)",
                }}
              >
                {tag.name}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Rich content */}
      {hasRichContent && (
        <div className="mb-4 max-h-64 overflow-y-auto rounded-lg bg-(--modal-surface)/5 p-4 scrollbar-thin">
          <RichTextRenderer content={content} />
        </div>
      )}

      {/* Fallback to excerpt if no rich content */}
      {!hasRichContent && data.excerpt && (
        <p className="mb-4 text-(--modal-text)/70 leading-relaxed">{data.excerpt}</p>
      )}

      {/* Featured people */}
      {featuredPeople.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-(--modal-text)/70">
            Featured
          </h3>
          <PeopleDisplay people={featuredPeople} size="md" />
        </div>
      )}

      {/* Credits */}
      {credits.length > 0 && (
        <div className="mb-4">
          <h3 className="mb-2 text-sm font-medium text-(--modal-text)/70">
            Credits
          </h3>
          <PeopleDisplay credits={credits} />
        </div>
      )}

      {/* External links */}
      {(data.externalLinks ?? []).length > 0 && (
        <div className="flex flex-wrap gap-2">
          {(data.externalLinks ?? []).map((link, idx) => (
            <a
              key={link.id || idx}
              href={link.url || "#"}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-(--modal-surface)/10 px-4 py-2 text-sm text-(--modal-text)/70 transition-colors hover:bg-(--modal-surface)/20 hover:text-(--modal-text)"
            >
              {link.label || "Link"}
              <ExternalLink className="h-4 w-4" />
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
