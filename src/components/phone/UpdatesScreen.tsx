"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BatteryMediumIcon, Loader2, SignalHigh } from "lucide-react";
import { PostCard } from "@/components/phone/PostCard";
import { usePosts } from "@/hooks/useCMS";
import type { PostType } from "@/constants/content";
import { staggerContainer, staggerItem } from "@/constants/animations";

type FilterType = PostType | undefined;

function StatusBarTime() {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => setTime(new Date()), 60000);
    return () => clearInterval(interval);
  }, []);

  return <>{time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</>;
}

export function UpdatesScreen() {
  const [filter] = useState<FilterType>(undefined);
  const {
    data: posts,
    loading,
    error,
  } = usePosts(filter ? { postType: filter } : undefined);

  if (error) {
    console.warn("Failed to fetch updates:", error);
  }

  return (
    <div className="flex h-full flex-col p-4 bg-black">
      {/* Loading state */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-(--phone-text)/40" />
        </div>
      )}

      {/* Content cards */}
      {!loading && (
        <>
          <div className="text-white flex flex-row justify-between">
            <div><StatusBarTime /></div>
            <div className="flex flex-row">
              <BatteryMediumIcon />
              <SignalHigh />
            </div>
          </div>
          <motion.div
            className="bg-(--phone-bg) flex-1 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-(--phone-surface)/5 scrollbar-thumb-(--phone-surface)/20 transform-3d"
            variants={staggerContainer}
            initial="hidden"
            animate="show"
          >
            {posts?.map((post) => (
              <motion.div key={post.id} variants={staggerItem}>
                <PostCard post={post} />
              </motion.div>
            ))}
            {(!posts || posts.length === 0) && (
              <p className="py-8 text-center text-base text-(--phone-text)/40">
                No content found
              </p>
            )}
          </motion.div>
        </>
      )}
    </div>
  );
}
