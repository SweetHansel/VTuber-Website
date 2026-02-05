'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { useModalStore } from '@/stores/modalStore'
import { cn, formatDate } from '@/lib/utils'
import { Calendar, MapPin, ExternalLink } from 'lucide-react'
import { POST_TYPE_COLORS, type PostType } from '@/constants/content'
import { getMedia, type Media } from '@/hooks/useCMS'
import type { Post } from '@/payload-types'

interface FeaturedImage {
  image?: number | Media | null
  caption?: string | null
  id?: string | null
}

interface ExternalLinkItem {
  label?: string | null
  url?: string | null
  id?: string | null
}

interface PostCardProps {
  post: Post
}

export function PostCard({ post }: Readonly<PostCardProps>) {
  const openModal = useModalStore((state) => state.openModal)

  // Extract display fields from post
  const title = String(post.title || '')
  const postType = (post.postType as PostType) || 'general'

  // Get first featured image from array
  const featuredImages = Array.isArray(post.featuredImages)
    ? (post.featuredImages as FeaturedImage[])
    : []
  const firstImage = featuredImages[0]
  const imageMedia = firstImage ? getMedia(firstImage.image) : undefined
  const image = imageMedia?.url

  // Event/date fields
  const eventDate = post.eventDate ? String(post.eventDate) : undefined
  const publishedAt = post.publishedAt ? String(post.publishedAt) : undefined
  const location = post.location ? String(post.location) : undefined

  // External links array
  const externalLinks = Array.isArray(post.externalLinks)
    ? (post.externalLinks as ExternalLinkItem[])
    : []
  const hasExternalLinks = externalLinks.length > 0

  // Excerpt
  const excerpt = post.excerpt ? String(post.excerpt) : undefined

  // Display date
  const date = eventDate || publishedAt || (post.createdAt ? String(post.createdAt) : undefined)

  const handleClick = () => {
    openModal('post', String(post.id), post)
  }

  return (
    <motion.article
      onClick={handleClick}
      className={cn(
        'group cursor-pointer overflow-hidden border-t border-primary',
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
          {post.isPinned && (
            <div className="absolute left-2 top-2 rounded-full bg-yellow-500/90 px-2 py-0.5 text-xs font-medium text-black">
              Pinned
            </div>
          )}
        </div>
      )}

      {/* Content */}
      <div className="p-3">
        {/* Type badge */}
        <span
          className={cn(
            'mb-2 inline-block rounded-full px-2 py-0.5 text-xs font-medium capitalize',
            POST_TYPE_COLORS[postType] || POST_TYPE_COLORS.general
          )}
        >
          {postType}
        </span>

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
          {hasExternalLinks && (
            <ExternalLink className="h-3 w-3 ml-auto" />
          )}
        </div>
      </div>
    </motion.article>
  )
}
