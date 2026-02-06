"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useAudioStore, type Track } from "@/stores/audioStore";
import { useModalStore } from "@/stores/modalStore";
import { cn, formatDuration } from "@/lib/utils";
import { Play, Pause, Music } from "lucide-react";
import { type MusicTrack, getMedia } from "@/hooks/useCMS";

interface SongCardProps {
  track: MusicTrack;
}

export function SongCard({ track }: Readonly<SongCardProps>) {
  const { currentTrack, isPlaying, setTrack, play, pause } = useAudioStore();
  const openModal = useModalStore((state) => state.openModal);

  // Extract display values from track
  const id = String(track.id);
  const title = track.title;
  const trackType = track.trackType;
  const coverArtMedia = getMedia(track.coverArt);
  const coverArt = coverArtMedia?.url || "/placeholder-cover-1.jpg";
  const audioFileMedia = getMedia(track.audioFile);
  const audioUrl = audioFileMedia?.url;
  const duration = track.duration ?? undefined;
  const originalArtist = track.originalArtist ?? undefined;

  const isCurrentTrack = currentTrack?.id === id;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlayClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    if (!audioUrl) return;

    if (isCurrentTrack) {
      isPlaying ? pause() : play();
    } else {
      const audioTrack: Track = {
        id,
        title,
        coverArt,
        audioUrl,
        duration: duration || 0,
        artist: originalArtist,
      };
      setTrack(audioTrack);
      play();
    }
  };

  const handleCardClick = () => {
    openModal("song", id, track);
  };

  return (
    <motion.div
      onClick={handleCardClick}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-pointer overflow-hidden"
    >
      {/* Cover Art */}
      <div
        className={cn(
          "relative aspect-square overflow-hidden",
          isCurrentTrack && "ring-2 ring-(--page-primary)",
        )}
      >
        <Image
          src={coverArt}
          alt={title}
          fill
          className="object-cover transition-transform group-hover:scale-105"
        />

        {/* Play button overlay */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
          {audioUrl ? (
            <button
              onClick={handlePlayClick}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-black transition-transform hover:scale-110"
            >
              {isCurrentlyPlaying ? (
                <Pause className="h-6 w-6" fill="currentColor" />
              ) : (
                <Play className="h-6 w-6 translate-x-0.5" fill="currentColor" />
              )}
            </button>
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-(--page-surface)/20 text-(--page-text)">
              <Music className="h-6 w-6" />
            </div>
          )}
        </div>

        {/* Type badge */}
        <div className="absolute left-2 top-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
              trackType === "original"
                ? "bg-green-500/80 text-white"
                : trackType === "cover" || trackType === "karaoke"
                  ? "bg-blue-500/80 text-white"
                  : trackType === "remix"
                    ? "bg-purple-500/80 text-white"
                    : "bg-gray-500/80 text-white",
            )}
          >
            {trackType}
          </span>
        </div>

        {/* Currently playing indicator */}
        {isCurrentlyPlaying && (
          <div className="absolute bottom-2 right-2 flex items-center gap-1">
            <span className="flex gap-0.5">
              {[1, 2, 3].map((bar) => (
                <motion.span
                  key={bar}
                  className="w-1 rounded-full bg-(--page-primary)"
                  animate={{
                    height: [4, 12, 4],
                  }}
                  transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    delay: bar * 0.1,
                  }}
                />
              ))}
            </span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        <h3 className="line-clamp-1 font-medium text-(--page-text)">{title}</h3>
        {originalArtist && (
          <p className="line-clamp-1 text-sm text-(--page-text)/60">
            Original: {originalArtist}
          </p>
        )}
        {duration && (
          <p className="mt-1 text-xs text-(--page-text)/40">
            {formatDuration(duration)}
          </p>
        )}
      </div>
    </motion.div>
  );
}
