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
  blog: 'bg-indigo-500/20 text-indigo-300',
  stream: 'bg-purple-500/20 text-purple-300',
  event: 'bg-blue-500/20 text-blue-300',
  release: 'bg-green-500/20 text-green-300',
  collab: 'bg-pink-500/20 text-pink-300',
  general: 'bg-gray-500/20 text-gray-300',
}