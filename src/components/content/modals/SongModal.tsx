"use client";

import Image from "next/image";
import { Play, Pause, ExternalLink } from "lucide-react";
import { useAudioStore, type Track } from "@/stores/audioStore";
import { formatDuration } from "@/lib/utils";

interface SongModalProps {
  id: string | null;
  data: Record<string, unknown>;
}

export function SongModalContent({
  id,
  data,
}: Readonly<SongModalProps>) {
  const { currentTrack, isPlaying, setTrack, play, pause } = useAudioStore();

  const trackId = id || "";
  const title = String(data.title || "Unknown Title");
  const trackType = String(data.trackType || "cover");
  const coverArt = String(data.coverArt || "/placeholder-cover.jpg");
  const audioUrl = data.audioUrl ? String(data.audioUrl) : undefined;
  const duration =
    typeof data.duration === "number" ? data.duration : undefined;
  const originalArtist = data.originalArtist
    ? String(data.originalArtist)
    : undefined;
  const streamingLinks = Array.isArray(data.streamingLinks)
    ? data.streamingLinks
    : [];

  const isCurrentTrack = currentTrack?.id === trackId;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlayClick = () => {
    if (!audioUrl) return;

    if (isCurrentTrack) {
      isPlaying ? pause() : play();
    } else {
      const track: Track = {
        id: trackId,
        title,
        coverArt,
        audioUrl,
        duration: duration || 0,
        artist: originalArtist,
      };
      setTrack(track);
      play();
    }
  };

  return (
    <div className="flex gap-6">
      {/* Cover Art */}
      <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl">
        <Image src={coverArt} alt={title} fill className="object-cover" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col">
        <span className="mb-2 w-fit rounded-full bg-blue-500/20 px-3 py-1 text-xs font-medium capitalize text-blue-400">
          {trackType}
        </span>

        <h2 className="mb-1 text-2xl font-bold text-(--modal-text)">{title}</h2>

        {originalArtist && (
          <p className="mb-2 text-(--modal-text)/60">
            Original by {originalArtist}
          </p>
        )}

        {duration && (
          <p className="mb-4 text-sm text-(--modal-text)/40">
            {formatDuration(duration)}
          </p>
        )}

        {/* Play Button */}
        {audioUrl && (
          <button
            onClick={handlePlayClick}
            className="mb-4 flex w-fit items-center gap-2 rounded-full bg-white px-6 py-3 font-medium text-black transition-transform hover:scale-105"
          >
            {isCurrentlyPlaying ? (
              <>
                <Pause className="h-5 w-5" fill="currentColor" />
                Pause
              </>
            ) : (
              <>
                <Play className="h-5 w-5 translate-x-0.5" fill="currentColor" />
                Play
              </>
            )}
          </button>
        )}

        {/* Streaming Links */}
        {streamingLinks.length > 0 && (
          <div className="mt-auto">
            <p className="mb-2 text-sm text-(--modal-text)/40">Listen on</p>
            <div className="flex flex-wrap gap-2">
              {streamingLinks.map((link: { platform: string; url: string }) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 rounded-full bg-(--modal-surface)/10 px-3 py-1.5 text-sm text-(--modal-text)/70 transition-colors hover:bg-(--modal-surface)/20 hover:text-(--modal-text)"
                >
                  {link.platform}
                  <ExternalLink className="h-3 w-3" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
