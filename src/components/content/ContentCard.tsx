'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useModalStore } from '@/stores/modalStore'
import { cn, formatDate } from '@/lib/utils'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import { ANNOUNCEMENT_TYPE_COLORS, type ContentCardProps } from '@/constants/content'

export type { ContentCardProps }

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
}: Readonly<ContentCardProps>) {
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
        'group cursor-pointer overflow-hidden border-t border-primary',
        // isPinned && 'ring-2 ring-yellow-500'
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
              ANNOUNCEMENT_TYPE_COLORS[announcementType] || ANNOUNCEMENT_TYPE_COLORS.general
            )}
          >
            {announcementType}
          </span>
        )}

        {/* Title */}
        <h3 className="mb-1 line-clamp-2 text-sm font-medium text-(--phone-text)">
          {title}
        </h3>

        {/* Excerpt */}
        {excerpt && (
          <p className="mb-2 line-clamp-2 text-xs text-(--phone-text)/60">{excerpt}</p>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap items-center gap-2 text-xs text-(--phone-text)/50">
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
