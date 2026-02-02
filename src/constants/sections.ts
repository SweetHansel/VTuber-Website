// Book sections/pages constants - single source of truth
// Used in: bookStore, BookLayout

/**
 * All book sections including the table of contents
 * Order matters - this defines the page order in the book
 */
export const BOOK_SECTIONS = [
  'toc',
  'about',
  'artworks',
  'discography',
  'vtuber-models',
] as const

export type BookSection = typeof BOOK_SECTIONS[number]

/**
 * Content sections (excludes toc which is a special page)
 * These are the sections that have PageContent components
 */
export const CONTENT_SECTIONS = [
  'about',
  'artworks',
  'discography',
  'vtuber-models',
] as const

export type ContentSection = typeof CONTENT_SECTIONS[number]
