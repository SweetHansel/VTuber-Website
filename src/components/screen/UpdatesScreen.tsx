"use client";

import { useState } from "react";
import { BatteryMediumIcon, Loader2, SignalHigh } from "lucide-react";
import {
  ContentCard,
  type ContentCardProps,
} from "@/components/content/ContentCard";
import { useUpdates, type UpdateItem } from "@/hooks/useCMS";

type FilterType = "all" | "announcements" | "blogs";

function transformUpdate(update: UpdateItem): ContentCardProps {
  return {
    id: String(update.id),
    type: update.type,
    title: update.title,
    excerpt: update.excerpt,
    image: update.image,
    date: update.date,
    eventDate: update.eventDate,
    location: update.location,
    announcementType: update.announcementType,
    isPinned: update.isPinned,
    externalLink: update.externalLink,
  };
}

export function UpdatesScreen() {
  const [filter, setFilter] = useState<FilterType>("all");
  const { data: cmsUpdates, loading, error } = useUpdates(filter);

  // Transform CMS data or use fallback
  const content: ContentCardProps[] =
    cmsUpdates && cmsUpdates.length > 0 ? cmsUpdates.map(transformUpdate) : [];

  // Apply filter for fallback data (CMS data is already filtered)
  const filteredContent =
    cmsUpdates && cmsUpdates.length > 0
      ? content
      : content.filter((item) => {
          if (filter === "all") return true;
          if (filter === "announcements") return item.type === "announcement";
          if (filter === "blogs") return item.type === "blog-post";
          return true;
        });

  // Sort: pinned first, then by date (already sorted by API, but ensure for fallback)
  const sortedContent =
    cmsUpdates && cmsUpdates.length > 0
      ? filteredContent
      : [...filteredContent].sort((a, b) => {
          if (a.isPinned && !b.isPinned) return -1;
          if (!a.isPinned && b.isPinned) return 1;
          const dateA = new Date(a.eventDate || a.date || 0);
          const dateB = new Date(b.eventDate || b.date || 0);
          return dateB.getTime() - dateA.getTime();
        });

  if (error) {
    console.warn("Failed to fetch updates, using fallback data:", error);
  }

  return (
    <div className="flex h-full flex-col p-1 bg-black">
      <div className="text-(--phone-text) flex flex-row justify-between">
        <div>12:07</div>
        <div className="flex flex-row">
          <BatteryMediumIcon />
          <SignalHigh />
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-(--phone-text)/40" />
        </div>
      )}

      {/* Content cards */}
      {!loading && (
        <div className="bg-(--phone-bg) flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-(--phone-surface)/5 scrollbar-thumb-(--phone-surface)/20">
          {sortedContent.map((item) => (
            <ContentCard key={`${item.type}-${item.id}`} {...item} />
          ))}
          {sortedContent.length === 0 && (
            <p className="py-8 text-center text-sm text-(--phone-text)/40">
              No content found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
