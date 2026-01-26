"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useAudioStore } from "@/stores/audioStore";
import { seekAudio } from "./AudioProvider";
import { cn } from "@/lib/utils";
import { formatDuration } from "@/lib/utils";
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
    togglePlay,
    setVolume,
    playNext,
    playPrevious,
    playTrackAt,
    removeFromQueue,
  } = useAudioStore();

  const [isExpanded, setIsExpanded] = useState(false);
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
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed h-15 bottom-0 left-0 right-0 z-10  -bg-linear-0 from-black px-4"
      >
        <div className="absolute h-full w-[60%] right-0 bottom-0">
          

          {/* Controls */}
          <div
            className={cn(
              "flex items-center gap-4 transition-all",
              isExpanded ? "py-4" : "py-2",
            )}
          >
            {/* Expand toggle */}
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-white/60 hover:text-white"
            >
              {isExpanded ? (
                <ChevronDown className="h-5 w-5" />
              ) : (
                <ChevronUp className="h-5 w-5" />
              )}
            </button>

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
                <h4 className="truncate text-sm font-medium text-white">
                  {currentTrack.title}
                </h4>
                {currentTrack.artist && (
                  <p className="truncate text-xs text-white/60">
                    {currentTrack.artist}
                  </p>
                )}
              </div>
            </div>

            {/* Playback controls */}
            <div className="flex items-center gap-2">
              <button
                onClick={playPrevious}
                className="p-2 text-white/60 hover:text-white"
              >
                <SkipBack className="h-5 w-5" />
              </button>

              <button
                onClick={togglePlay}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-black hover:scale-105"
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
                className="p-2 text-white/60 hover:text-white"
              >
                <SkipForward className="h-5 w-5" />
              </button>
            </div>

            {/* Time display */}
            <div className="hidden w-24 text-center text-xs text-white/60 md:block">
              {formatDuration(playbackPosition)} / {formatDuration(duration)}
            </div>

            {/* Volume */}
            <div className="hidden items-center gap-2 md:flex">
              <button
                onClick={handleVolumeToggle}
                className="p-2 text-white/60 hover:text-white"
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
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="h-1 w-20 appearance-none rounded-full bg-white/20 accent-blue-500"
              />
            </div>

            {/* Queue toggle */}
            <button
              onClick={() => setShowQueue(!showQueue)}
              className={cn(
                "p-2 transition-colors",
                showQueue ? "text-blue-400" : "text-white/60 hover:text-white",
              )}
            >
              <ListMusic className="h-5 w-5" />
            </button>
          </div>
          {/* Progress bar */}
          <div
            ref={progressRef}
            onClick={handleProgressClick}
            className="group h-1 cursor-pointer bg-white/10"
          >
            <motion.div
              className="h-full bg-blue-500 transition-all group-hover:h-1.5"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </motion.div>

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
              <div className="flex items-center justify-between border-b border-white/10 p-4">
                <h3 className="font-medium text-white">Queue</h3>
                <button
                  onClick={() => setShowQueue(false)}
                  className="text-white/60 hover:text-white"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-2">
                {queue.length === 0 ? (
                  <p className="py-8 text-center text-sm text-white/40">
                    Queue is empty
                  </p>
                ) : (
                  queue.map((track, index) => (
                    <div
                      key={`${track.id}-${index}`}
                      onClick={() => playTrackAt(index)}
                      className={cn(
                        "flex cursor-pointer items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/10",
                        index === queueIndex && "bg-white/10",
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
                                  className="w-0.5 rounded-full bg-blue-500"
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
                        <p className="truncate text-sm text-white">
                          {track.title}
                        </p>
                        <p className="truncate text-xs text-white/60">
                          {formatDuration(track.duration)}
                        </p>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeFromQueue(index);
                        }}
                        className="p-1 text-white/40 hover:text-white"
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
