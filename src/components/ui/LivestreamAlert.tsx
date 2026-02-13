"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useLivestreamStore, getPrimaryStream } from "@/stores/livestreamStore";
import { cn } from "@/lib/utils";
import { Radio, X, ExternalLink, Users } from "lucide-react";
import { POLLING_INTERVAL_MS } from "@/constants/config";

export function LivestreamAlert() {
  const { streams, showAlert, hideAlertBanner } =
    useLivestreamStore();

  const primaryStream = getPrimaryStream(streams.filter(() => showAlert));

  // Auto-poll for livestream status
  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const res = await fetch("/api/livestream/status");
        if (res.ok) {
          const data = await res.json();
          useLivestreamStore.getState().setStreams(data.streams || []);
          useLivestreamStore.getState().setLastChecked(new Date());
        }
      } catch (error) {
        console.error("Failed to check livestream status:", error);
      }
    };

    // Initial check
    checkLiveStatus();

    // Poll at configured interval
    const interval = setInterval(checkLiveStatus, POLLING_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  if (!primaryStream) return null;

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          className={cn(
            "fixed z-50 rounded-xl shadow-2xl",
            "bottom-24 right-4 w-72 md:bottom-20 md:w-80",
          )}
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
        >
          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 rounded-xl border-3 border-red-500"
            animate={{
              opacity: [0.5, 0],
              scale: [1, 1.06],
            }}
            transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
          />
          {/* Background with gradient border */}
            <div className="relative rounded-xl bg-(--modal-bg) p-4 ">
              {/* Close button */}
              <button
                onClick={() => hideAlertBanner()}
                className="absolute right-2 top-4 rounded-full p-4 text-(--modal-text)/60 transition-colors hover:bg-(--modal-text)/10 hover:text-(--modal-text)"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Live indicator */}
              <div className="mb-2 flex items-center  gap-4 ">
                <span className="flex items-center  gap-4 ">
                  <Radio className="h-4 w-4 animate-pulse text-red-500" />
                  <span className="text-sm font-bold uppercase text-red-500">
                    Live
                  </span>
                </span>
                <span className="text-sm capitalize text-(--modal-text)/60">
                  on {primaryStream.platform}
                </span>
              </div>

              {/* Thumbnail */}
              {primaryStream.thumbnail && (
                <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={primaryStream.thumbnail}
                    alt={primaryStream.title}
                    fill
                    className="object-cover"
                  />
                  {/* Viewer count overlay */}
                  {primaryStream.viewerCount !== undefined && (
                    <div className="absolute bottom-1 right-1 flex items-center  gap-4 rounded bg-(--modal-bg)/70 px-1.5 py-0.5 text-sm text-(--modal-text)">
                      <Users className="h-3 w-3" />
                      {primaryStream.viewerCount.toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Stream info */}
              <h3 className="mb-1 line-clamp-1 text-base font-medium text-(--modal-text)">
                {primaryStream.title}
              </h3>
              <p className="mb-3 text-sm text-(--modal-text)/60">
                {primaryStream.channelName}
                {!primaryStream.isOwner && " (Friend)"}
              </p>

              {/* Watch button */}
              <a
                href={primaryStream.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center  gap-4 rounded-lg bg-red-600 py-2 text-base font-medium text-white transition-colors hover:bg-red-700"
              >
                <ExternalLink className="h-4 w-4" />
                Watch Now
              </a>
            </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
