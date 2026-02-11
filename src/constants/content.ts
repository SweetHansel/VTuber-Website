// Content type constants - single source of truth
// Used in: PostCard, Modal, api/cms/updates, useCMS

/**
 * Post types for categorization and badges
 */
export type PostType = 'blog' | 'stream' | 'event' | 'release' | 'collab' | 'general'

/**
 * Color mapping for post type badges
 * Used consistently across PosttCard and Modal
 */
export const POST_TYPE_COLORS: Record<PostType, string> = {
  blog: 'bg-indigo-500 text-white',
  stream: 'bg-purple-500 text-white',
  event: 'bg-blue-500 text-white',
  release: 'bg-green-500 text-white',
  collab: 'bg-pink-500 text-white',
  general: 'bg-gray-500 text-white',
}