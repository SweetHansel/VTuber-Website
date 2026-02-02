// Content type constants - single source of truth
// Used in: ContentCard, Modal, api/cms/updates, useCMS

/**
 * Content types for updates feed (announcements + blog posts)
 */
export type ContentType = 'announcement' | 'blog-post'

/**
 * Announcement sub-types for badges
 */
export type AnnouncementType = 'stream' | 'event' | 'release' | 'collab' | 'general'

/**
 * Color mapping for announcement type badges
 * Used consistently across ContentCard and Modal
 */
export const ANNOUNCEMENT_TYPE_COLORS: Record<AnnouncementType | string, string> = {
  stream: 'bg-purple-500/20 text-purple-300',
  event: 'bg-blue-500/20 text-blue-300',
  release: 'bg-green-500/20 text-green-300',
  collab: 'bg-pink-500/20 text-pink-300',
  general: 'bg-gray-500/20 text-gray-300',
}

/**
 * Combined update item type for the /api/cms/updates endpoint
 * which merges announcements and blog posts into a unified feed
 */
export interface UpdateItem {
  id: string
  type: ContentType
  title: string
  excerpt?: string
  image?: string
  date?: string
  eventDate?: string
  location?: string
  announcementType?: string
  isPinned?: boolean
  externalLink?: string
}

/**
 * Props for content card component
 * Extends UpdateItem since they share the same shape
 */
export type ContentCardProps = UpdateItem
