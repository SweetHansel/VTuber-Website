"use client";

import { useState } from "react";
import { BatteryMediumIcon, Loader2, SignalHigh } from "lucide-react";
import { PostCard } from "@/components/phone/PostCard";
import { usePosts } from "@/hooks/useCMS";
import type { PostType } from "@/constants/content";

type FilterType = PostType | undefined;

export function UpdatesScreen() {
  const [filter] = useState<FilterType>(undefined);
  const { data: posts, loading, error } = usePosts(filter ? { postType: filter } : undefined);

  if (error) {
    console.warn("Failed to fetch updates:", error);
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
          {posts?.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          {(!posts || posts.length === 0) && (
            <p className="py-8 text-center text-sm text-(--phone-text)/40">
              No content found
            </p>
          )}
        </div>
      )}
    </div>
  );
}
