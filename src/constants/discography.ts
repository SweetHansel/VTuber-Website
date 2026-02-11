// Track type constants
// Used in: SongCard, SongModal

import type { MusicTrack } from '@/payload-types'

export type TrackType = MusicTrack['trackType']

export const TRACK_TYPE_COLORS: Record<TrackType, string> = {
  original: 'bg-green-500 text-white',
  cover: 'bg-blue-500 text-white',
  karaoke: 'bg-blue-500 text-white',
  remix: 'bg-purple-500 text-white',
  other: 'bg-gray-500 text-white',
}
