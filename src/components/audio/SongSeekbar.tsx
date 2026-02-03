"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAudioStore } from "@/stores/audioStore";
import { seekAudio } from "./AudioProvider";
import { cn, formatDuration } from "@/lib/utils";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  ListMusic,
  X,
} from "lucide-react";

export function SongSeekbar() {
  const {
    currentTrack,
    isPlaying,
    volume,
    playbackPosition,
    duration,
    queue,
    queueIndex,
    isExpanded,
    togglePlay,
    setVolume,
    playNext,
    playPrevious,
    playTrackAt,
    removeFromQueue,
    setExpanded,
  } = useAudioStore();

  const [showQueue, setShowQueue] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const progressRef = useRef<HTMLDivElement>(null);

  const handleProgressClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressRef.current || !duration) return;

      const rect = progressRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const percentage = x / rect.width;
      const newTime = percentage * duration;

      seekAudio(newTime);
    },
    [duration],
  );

  const handleVolumeToggle = () => {
    if (isMuted) {
      setVolume(prevVolume);
      setIsMuted(false);
    } else {
      setPrevVolume(volume);
      setVolume(0);
      setIsMuted(true);
    }
  };

  const progressPercent =
    duration > 0 ? (playbackPosition / duration) * 100 : 0;

  if (!currentTrack) return null;

  return (
    <>
      {/* Seekbar */}

      <AnimatePresence>
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed h-15 bottom-0 left-0 right-0 z-10 pointer-events-none"
        >
          {/* Minimized: album art square with expand icon */}
          <AnimatePresence>
            {!isExpanded && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                onClick={() => setExpanded(true)}
                className="absolute bottom-4 right-4 z-10 group h-12 w-12 overflow-hidden rounded-lg shadow-lg pointer-events-auto"
              >
                <Image
                  src={currentTrack.coverArt}
                  alt={currentTrack.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                  <ChevronUp className="h-5 w-5 text-(--page-text)" />
                </div>
              </motion.button>
            )}
          </AnimatePresence>

          {/* Expanded: full controls bar */}
          {isExpanded && (
            <motion.div
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute h-full w-full right-0 bottom-0  pointer-events-auto bg-linear-0 from-black"
            >
              <div className=" absolute h-full w-[60%] right-0">
                {/* Controls */}
                <div className="flex items-center gap-4 py-2 px-2">
                  {/* Track info */}
                  <div className="flex flex-1 items-center gap-3">
                    <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md">
                      <Image
                        src={currentTrack.coverArt}
                        alt={currentTrack.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-medium text-(--page-text)">
                        {currentTrack.title}
                      </h4>
                      {currentTrack.artist && (
                        <p className="truncate text-xs text-(--page-text)/60">
                          {currentTrack.artist}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Playback controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={playPrevious}
                      className="p-2 text-(--page-text)/60 hover:text-(--page-text)"
                    >
                      <SkipBack className="h-5 w-5" />
                    </button>

                    <button
                      onClick={togglePlay}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-(--page-surface) text-black hover:scale-105"
                    >
                      {isPlaying ? (
                        <Pause className="h-5 w-5" fill="currentColor" />
                      ) : (
                        <Play
                          className="h-5 w-5 translate-x-0.5"
                          fill="currentColor"
                        />
                      )}
                    </button>

                    <button
                      onClick={playNext}
                      className="p-2 text-(--page-text)/60 hover:text-(--page-text)"
                    >
                      <SkipForward className="h-5 w-5" />
                    </button>
                  </div>

                  {/* Time display */}
                  <div className="hidden w-24 text-center text-xs text-(--page-text)/60 md:block">
                    {formatDuration(playbackPosition)} /{" "}
                    {formatDuration(duration)}
                  </div>

                  {/* Volume */}
                  <div className="hidden items-center gap-2 md:flex">
                    <button
                      onClick={handleVolumeToggle}
                      className="p-2 text-(--page-text)/60 hover:text-(--page-text)"
                    >
                      {isMuted || volume === 0 ? (
                        <VolumeX className="h-5 w-5" />
                      ) : (
                        <Volume2 className="h-5 w-5" />
                      )}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="1"
                      step="0.01"
                      value={volume}
                      onChange={(e) => setVolume(Number.parseFloat(e.target.value))}
                      className="h-1 w-20 appearance-none rounded-full bg-(--page-surface)/20 accent-(--page-primary)"
                    />
                  </div>

                  {/* Queue toggle */}
                  <button
                    onClick={() => setShowQueue(!showQueue)}
                    className={cn(
                      "p-2 transition-colors",
                      showQueue
                        ? "text-(--page-primary)"
                        : "text-(--page-text)/60 hover:text-(--page-text)",
                    )}
                  >
                    <ListMusic className="h-5 w-5" />
                  </button>

                  {/* Collapse toggle */}
                  <button
                    onClick={() => setExpanded(false)}
                    className="text-(--page-text)/60 hover:text-(--page-text)"
                  >
                    <ChevronDown className="h-5 w-5" />
                  </button>
                </div>

                {/* Progress bar */}
                <div
                  ref={progressRef}
                  onClick={handleProgressClick}
                  className="group h-2 cursor-pointer bg-(--page-surface)/10"
                >
                  <motion.div
                    className="h-full bg-(--page-primary) transition-all group-hover:h-1.5"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Queue panel */}
      <AnimatePresence>
        {showQueue && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="fixed bottom-16 right-0 top-0 z-20 w-80 bg-black/90 backdrop-blur-lg"
          >
            <div className="flex h-full flex-col">
              <div className="flex items-center justify-between border-b border-(--page-surface)/10 p-4">
                <h3 className="font-medium text-(--page-text)">Queue</h3>
                <button
                  onClick={() => setShowQueue(false)}
                  className="text-(--page-text)/60 hover:text-(--page-text)"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {queue.length === 0 ? (
                  <p className="py-8 text-center text-sm text-(--page-text)/40">
                    Queue is empty
                  </p>
                ) : (
                  queue.map((track, index) => (
                    <div
                      key={`${track.id}-${index}`}
                      onClick={() => playTrackAt(index)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-(--page-surface)/10",
                        index === queueIndex && "bg-(--page-surface)/10",
                      )}
                    >
                      <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                        <Image
                          src={track.coverArt}
                          alt={track.title}
                          fill
                          className="object-cover"
                        />
                        {index === queueIndex && isPlaying && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                            <span className="flex gap-0.5">
                              {[1, 2, 3].map((bar) => (
                                <motion.span
                                  key={bar}
                                  className="w-0.5 rounded-full bg-(--page-primary)"
                                  animate={{ height: [2, 8, 2] }}
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
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm text-(--page-text)">
                          {track.title}
                        </p>
                        <p className="truncate text-xs text-(--page-text)/60">
                          {formatDuration(track.duration)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(index);
                        }}
                        className="p-1 text-(--page-text)/40 hover:text-(--page-text)"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
