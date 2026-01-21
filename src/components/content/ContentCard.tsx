'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useModalStore } from '@/stores/modalStore'
import { cn } from '@/lib/utils'
import { formatDate } from '@/lib/utils'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'

export interface ContentCardProps {
  id: string
  type: 'announcement' | 'blog-post'
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

const typeColors: Record<string, string> = {
  stream: 'bg-purple-500/20 text-purple-300',
  event: 'bg-blue-500/20 text-blue-300',
  release: 'bg-green-500/20 text-green-300',
  collab: 'bg-pink-500/20 text-pink-300',
  general: 'bg-gray-500/20 text-gray-300',
}

export function ContentCard({
  id,
  type,
  title,
  excerpt,
  image,
  date,
  eventDate,
  location,
  announcementType,
  isPinned,
  externalLink,
}: ContentCardProps) {
  const openModal = useModalStore((state) => state.openModal)

  const handleClick = () => {
    openModal(type, id, {
      title,
      excerpt,
      image,
      date,
      eventDate,
      location,
      announcementType,
    })
  }

  return (
    <motion.article
      onClick={handleClick}
      className={cn(
        'group cursor-pointer overflow-hidden rounded-xl bg-white/5 transition-colors hover:bg-white/10',
        isPinned && 'ring-1 ring-yellow-500/30'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Image */}
      {image && (
        <div className="relative aspect-video w-full overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {isPinned && (
            <div className="absolute left-2 top-2 rounded-full bg-yellow-500/90 px-2 py-0.5 text-xs font-medium text-black">
              Pinned
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        {/* Type badge */}
        {type === 'announcement' && announcementType && (
          <span
            className={cn(
              'mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize',
              typeColors[announcementType] || typeColors.general
            )}
          >
            {announcementType}
          </span>
        )}

        {/* Title */}
        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-white">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="mb-2 line-clamp-2 text-xs text-white/60">{excerpt}</p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-white/50">
          {eventDate && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {formatDate(eventDate, { month: 'short', day: 'numeric' })}
            </span>
          )}
          {location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {location}
            </span>
          )}
          {date && !eventDate && (
            <span>{formatDate(date, { month: 'short', day: 'numeric' })}</span>
          )}
          {externalLink && (
            <ExternalLink className="h-3 w-3 ml-auto" />
          )}
        </div>
      </div>
    </motion.article>
  )
}
