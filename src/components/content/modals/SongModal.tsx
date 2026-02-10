"use client";

import { useState } from "react";
import Image from "next/image";
import { Play, Pause, ExternalLink, ChevronDown, ChevronUp, Calendar, Disc } from "lucide-react";
import { useAudioStore, type Track } from "@/stores/audioStore";
import { formatDuration, formatDate } from "@/lib/utils";
import { PeopleDisplay, Tags, Badge } from "@/components/ui";
import { RichTextRenderer } from "@/components/ui/RichTextRenderer";
import { TRACK_TYPE_COLORS, type TrackType } from "@/constants/discography";
import { getMedia, getTag, getAlbum } from "@/hooks/useCMS";
import type { Credit } from "@/lib/people";
import type { MusicTrack, Tag as CMSTag } from "@/payload-types";

interface SongModalProps {
  data: MusicTrack;
}

const PLATFORM_COLORS: Record<string, string> = {
  youtube: 'bg-red-500/20 text-red-300 hover:bg-red-500/30',
  'youtube-music': 'bg-red-500/20 text-red-300 hover:bg-red-500/30',
  spotify: 'bg-green-500/20 text-green-300 hover:bg-green-500/30',
  'apple-music': 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30',
  soundcloud: 'bg-orange-500/20 text-orange-300 hover:bg-orange-500/30',
  bandcamp: 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30',
  other: 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30',
};

const PLATFORM_LABELS: Record<string, string> = {
  youtube: 'YouTube',
  'youtube-music': 'YouTube Music',
  spotify: 'Spotify',
  'apple-music': 'Apple Music',
  soundcloud: 'SoundCloud',
  bandcamp: 'Bandcamp',
  other: 'Link',
};

export function SongModalContent({
  data,
}: Readonly<SongModalProps>) {
  const { currentTrack, isPlaying, setTrack, play, pause } = useAudioStore();
  const [showLyrics, setShowLyrics] = useState(false);

  const trackId = String(data.id);
  const coverArtMedia = getMedia(data.coverArt);
  const coverArt = coverArtMedia?.url || "/placeholder-cover.jpg";
  const audioFileMedia = getMedia(data.audioFile);
  const audioUrl = audioFileMedia?.url;

  const album = getAlbum(data.album);
  const albumCover = album ? getMedia(album.coverArt) : undefined;

  const tags = (data.tags ?? []).map(getTag).filter((t): t is CMSTag => !!t);

  const hasLyrics = data.lyrics?.root?.children && data.lyrics.root.children.length > 0;

  const credits: Credit[] = (data.credits ?? []).map((c) => ({
    role: c.role,
    artist: c.artist as Credit['artist'],
    name: c.name ?? undefined,
    id: c.id ?? undefined,
  }));

  const isCurrentTrack = currentTrack?.id === trackId;
  const isCurrentlyPlaying = isCurrentTrack && isPlaying;

  const handlePlayClick = () => {
    if (!audioUrl) return;

    if (isCurrentTrack) {
      isPlaying ? pause() : play();
    } else {
      const track: Track = {
        id: trackId,
        title: data.title,
        coverArt,
        audioUrl,
        duration: data.duration || 0,
        artist: data.originalArtist ?? undefined,
      };
      setTrack(track);
      play();
    }
  };

  return (
    <div className="flex  gap-4 ">
      {/* Cover Art */}
      <div className="relative h-48 w-48 shrink-0 overflow-hidden rounded-xl">
        <Image src={coverArt} alt={data.title} fill className="object-cover" />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <Badge
          label={data.trackType}
          colorClass={TRACK_TYPE_COLORS[data.trackType as TrackType]}
          className="mb-2"
        />

        <h2 className="mb-1 text-2xl font-bold text-(--modal-text)">{data.title}</h2>

        {data.originalArtist && (
          <p className="mb-2 text-(--modal-text)/60">
            Original by {data.originalArtist}
          </p>
        )}

        {/* Meta info row */}
        <div className="mb-4 flex flex-wrap items-center  gap-4 text-base text-(--modal-text)/40">
          {data.duration && <span>{formatDuration(data.duration)}</span>}
          {data.releaseDate && (
            <span className="flex items-center  gap-4 ">
              <Calendar className="h-3.5 w-3.5" />
              {formatDate(data.releaseDate, { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          )}
        </div>

        {/* Album */}
        {album && (
          <div className="mb-4 flex items-center  gap-4 rounded-lg bg-(--modal-surface)/5 p-4 ">
            {albumCover?.url && (
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded">
                <Image src={albumCover.url} alt={album.title} fill className="object-cover" />
              </div>
            )}
            {!albumCover?.url && (
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded bg-(--modal-surface)/10">
                <Disc className="h-5 w-5 text-(--modal-text)/40" />
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm text-(--modal-text)/40">From album</p>
              <p className="truncate text-base font-medium text-(--modal-text)">{album.title}</p>
            </div>
          </div>
        )}

        {/* Play Button */}
        {audioUrl && (
          <button
            onClick={handlePlayClick}
            className="mb-4 flex w-fit items-center  gap-4 rounded-full bg-white px-6 py-3 font-medium text-black transition-transform hover:scale-105"
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

        {/* Credits */}
        {credits.length > 0 && (
          <div className="mb-4">
            <p className="mb-2 text-base text-(--modal-text)/40">Credits</p>
            <PeopleDisplay credits={credits} />
          </div>
        )}

        {/* Tags */}
        <Tags tags={tags} className="mb-4" />

        {/* Lyrics (collapsible) */}
        {hasLyrics && (
          <div className="mb-4">
            <button
              onClick={() => setShowLyrics(!showLyrics)}
              className="flex items-center  gap-4 text-base text-(--modal-text)/60 hover:text-(--modal-text)"
            >
              {showLyrics ? (
                <>
                  <ChevronUp className="h-4 w-4" />
                  Hide Lyrics
                </>
              ) : (
                <>
                  <ChevronDown className="h-4 w-4" />
                  Show Lyrics
                </>
              )}
            </button>
            {showLyrics && (
              <div className="mt-3 max-h-48 overflow-y-auto rounded-lg bg-(--modal-surface)/5 p-4 scrollbar-thin">
                <RichTextRenderer content={data.lyrics} className="text-base whitespace-pre-wrap" />
              </div>
            )}
          </div>
        )}

        {/* Streaming Links */}
        {(data.streamingLinks ?? []).length > 0 && (
          <div className="mt-auto">
            <p className="mb-2 text-base text-(--modal-text)/40">Listen on</p>
            <div className="flex flex-wrap  gap-4 ">
              {(data.streamingLinks ?? []).map((link) => (
                <a
                  key={link.platform}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center  gap-4 .5 rounded-full px-3 py-1.5 text-base font-medium transition-colors ${
                    PLATFORM_COLORS[link.platform] || PLATFORM_COLORS.other
                  }`}
                >
                  {PLATFORM_LABELS[link.platform] || link.platform}
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
