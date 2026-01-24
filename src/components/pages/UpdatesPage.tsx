'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ContentCard, type ContentCardProps } from '@/components/content/ContentCard'
import { useUpdates, type UpdateItem } from '@/hooks/useCMS'
import { cn } from '@/lib/utils'

type FilterType = 'all' | 'announcements' | 'blogs'

// Fallback mock data
const mockContent: ContentCardProps[] = [
  {
    id: '1',
    type: 'announcement',
    title: 'New Year Stream 2026!',
    excerpt: 'Join me for a special countdown stream!',
    image: '/placeholder-stream.jpg',
    eventDate: '2026-01-01T23:00:00',
    location: 'YouTube Live',
    announcementType: 'stream',
    isPinned: true,
  },
  {
    id: '2',
    type: 'announcement',
    title: 'New Original Song Release',
    announcementType: 'release',
    excerpt: 'My first original song is finally here!',
    date: '2026-01-15',
  },
  {
    id: '3',
    type: 'blog-post',
    title: 'My Journey as a VTuber',
    excerpt: 'Reflecting on an amazing year of streaming and growth...',
    image: '/placeholder-blog.jpg',
    date: '2026-01-10',
  },
]

function transformUpdate(update: UpdateItem): ContentCardProps {
  return {
    id: update.id,
    type: update.type,
    title: update.title,
    excerpt: update.excerpt,
    image: update.image,
    date: update.date,
    eventDate: update.eventDate,
    location: update.location,
    announcementType: update.announcementType,
    isPinned: update.isPinned,
    externalLink: update.externalLink,
  }
}

export function UpdatesPage() {
  const [filter, setFilter] = useState<FilterType>('all')
  const { data: cmsUpdates, loading, error } = useUpdates(filter)

  // Transform CMS data or use fallback
  const content: ContentCardProps[] = cmsUpdates && cmsUpdates.length > 0
    ? cmsUpdates.map(transformUpdate)
    : mockContent

  // Apply filter for fallback data (CMS data is already filtered)
  const filteredContent = cmsUpdates && cmsUpdates.length > 0
    ? content
    : content.filter((item) => {
        if (filter === 'all') return true
        if (filter === 'announcements') return item.type === 'announcement'
        if (filter === 'blogs') return item.type === 'blog-post'
        return true
      })

  // Sort: pinned first, then by date (already sorted by API, but ensure for fallback)
  const sortedContent = cmsUpdates && cmsUpdates.length > 0
    ? filteredContent
    : [...filteredContent].sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1
        if (!a.isPinned && b.isPinned) return 1
        const dateA = new Date(a.eventDate || a.date || 0)
        const dateB = new Date(b.eventDate || b.date || 0)
        return dateB.getTime() - dateA.getTime()
      })

  if (error) {
    console.warn('Failed to fetch updates, using fallback data:', error)
  }

  return (
    <div className="flex h-full flex-col p-4">
      {/* Header */}
      <h2 className="mb-4 text-lg font-semibold text-white">Updates</h2>

      {/* Filter tabs */}
      <div className="mb-3 flex gap-1 rounded-lg bg-white/5 p-1">
        {(['all', 'announcements', 'blogs'] as FilterType[]).map((type) => (
          <button
            key={type}
            onClick={() => setFilter(type)}
            className={cn(
              'flex-1 rounded-md px-2 py-1.5 text-xs font-medium capitalize transition-colors',
              filter === type
                ? 'bg-white/20 text-white'
                : 'text-white/60 hover:text-white'
            )}
          >
            {type}
          </button>
        ))}
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex flex-1 items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-white/40" />
        </div>
      )}

      {/* Content cards */}
      {!loading && (
        <div className="flex-1 space-y-3 overflow-y-auto pr-1 scrollbar-thin scrollbar-track-white/5 scrollbar-thumb-white/20">
          {sortedContent.map((item) => (
            <ContentCard key={item.id} {...item} />
          ))}
          {sortedContent.length === 0 && (
            <p className="py-8 text-center text-sm text-white/40">
              No content found
            </p>
          )}
        </div>
      )}
    </div>
  )
}
