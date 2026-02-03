// Livestream type constants - single source of truth
// Used in: livestreamStore, api/livestream/status

/**
 * Supported streaming platforms
 */
export type StreamPlatform = 'twitch' | 'youtube'

/**
 * Livestream data structure
 */
export interface LiveStream {
  channelId: string
  channelName: string
  platform: StreamPlatform
  streamUrl: string
  title: string
  thumbnail?: string
  viewerCount?: number
  /**
   * Whether this is the site owner's stream (vs a friend's stream)
   * Used for prioritization and display
   */
  isOwner: boolean
  /**
   * Priority for sorting (higher = more important)
   */
  priority: number
}
