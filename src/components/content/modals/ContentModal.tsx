"use client";

import Image from "next/image";
import { Calendar, MapPin } from "lucide-react";
import { cn, formatDate } from "@/lib/utils";
import {
  ANNOUNCEMENT_TYPE_COLORS,
  type ContentType,
} from "@/constants/content";

interface ContentModalProps {
  type: ContentType;
  data: Record<string, unknown>;
}

export function ContentModalContent({
  type,
  data,
}: Readonly<ContentModalProps>) {
  const title = String(data.title || "");
  const excerpt = data.excerpt ? String(data.excerpt) : undefined;
  const image = data.image ? String(data.image) : undefined;
  const date = data.date ? String(data.date) : undefined;
  const eventDate = data.eventDate ? String(data.eventDate) : undefined;
  const location = data.location ? String(data.location) : undefined;
  const announcementType = data.announcementType
    ? String(data.announcementType)
    : undefined;

  return (
    <div>
      {/* Image */}
      {image && (
        <div className="relative -mx-6 -mt-6 mb-6 aspect-video overflow-hidden rounded-t-2xl">
          <Image src={image} alt={title} fill className="object-cover" />
        </div>
      )}

      {/* Type badge */}
      {type === "announcement" && announcementType && (
        <span
          className={cn(
            "mb-3 inline-block rounded-full px-3 py-1 text-sm font-medium capitalize",
            ANNOUNCEMENT_TYPE_COLORS[announcementType] ||
              ANNOUNCEMENT_TYPE_COLORS.general,
          )}
        >
          {announcementType}
        </span>
      )}

      {type === "blog-post" && (
        <span className="mb-3 inline-block rounded-full bg-indigo-500/20 px-3 py-1 text-sm font-medium text-indigo-300">
          Blog Post
        </span>
      )}

      {/* Title */}
      <h2 className="mb-3 text-2xl font-bold text-(--modal-text)">{title}</h2>

      {/* Meta info */}
      <div className="mb-4 flex flex-wrap items-center gap-4 text-sm text-(--modal-text)/60">
        {eventDate && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(eventDate, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
        {location && (
          <span className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" />
            {location}
          </span>
        )}
        {date && !eventDate && (
          <span className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" />
            {formatDate(date, {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </span>
        )}
      </div>

      {/* Content */}
      {excerpt && (
        <p className="text-(--modal-text)/70 leading-relaxed">{excerpt}</p>
      )}
    </div>
  );
}
