'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { staggerContainerVariants, staggerItemVariants } from '@/animations'
import { cn } from '@/lib/utils'
import { Heart, ThumbsDown, Gamepad, Hash, Calendar, Ruler, LucideIcon, Star, Music, Sparkles, Coffee, Loader2 } from 'lucide-react'
import type { PageContent } from '@/components/layout/BookLayout'
import { useProfile, type ProfileData } from '@/hooks/useCMS'

// Icon mapping for dynamic traits
const iconMap: Record<string, LucideIcon> = {
  Gamepad,
  Heart,
  ThumbsDown,
  Star,
  Music,
  Sparkles,
  Coffee,
  Hash,
}

function LoadingSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-white/40" />
    </div>
  )
}

function AboutLeft() {
  const { data: profile, loading } = useProfile()
  const profileData = profile || {}

  if (loading) {
    return <LoadingSkeleton />
  }

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className="flex h-full flex-col items-center justify-center gap-4 p-6"
    >
      <motion.div
        variants={staggerItemVariants}
        className="relative aspect-[3/4] w-48 overflow-hidden rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20"
      >
        {profileData.avatar?.url ? (
          <Image
            src={profileData.avatar.url}
            alt={profileData.name || 'Avatar'}
            fill
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-white/20">
            <span className="text-4xl">?</span>
          </div>
        )}
      </motion.div>
      <motion.button
        variants={staggerItemVariants}
        className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
      >
        View All Models →
      </motion.button>
    </motion.div>
  )
}

function AboutRight() {
  const { data: profile, loading } = useProfile()
  const profileData = profile || {}

  if (loading) {
    return <LoadingSkeleton />
  }

  // Convert traits array to named sections for compatibility
  const hobbies = profileData.traits?.find(t => t.category.toLowerCase() === 'hobbies')
  const likes = profileData.traits?.find(t => t.category.toLowerCase() === 'likes')
  const dislikes = profileData.traits?.find(t => t.category.toLowerCase() === 'dislikes')

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className="h-full space-y-6 overflow-y-auto p-6"
    >
      {/* Name & Tagline */}
      <motion.div variants={staggerItemVariants}>
        <h1 className="text-3xl font-bold text-white">{profileData.name}</h1>
        {profileData.japaneseName && (
          <p className="text-lg text-white/60">{profileData.japaneseName}</p>
        )}
        {profileData.tagline && (
          <p className="mt-1 text-blue-300">{profileData.tagline}</p>
        )}
      </motion.div>

      {/* Bio */}
      {profileData.shortBio && (
        <motion.p variants={staggerItemVariants} className="text-white/80">
          {profileData.shortBio}
        </motion.p>
      )}

      {/* Stats */}
      <motion.div variants={staggerItemVariants} className="flex gap-6">
        {profileData.birthday && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">
              {new Date(profileData.birthday).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
        {profileData.height && (
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">{profileData.height}</span>
          </div>
        )}
      </motion.div>

      {/* Info sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Dynamic traits from CMS */}
        {profileData.traits?.map((trait) => {
          const IconComponent = iconMap[trait.icon || 'Star'] || Star
          const items = trait.items?.map(i => i.value) || []
          return (
            <InfoSection
              key={trait.category}
              icon={IconComponent}
              title={trait.category}
              items={items}
              customColor={trait.color}
            />
          )
        })}

        {/* Fallback sections if no traits defined */}
        {(!profileData.traits || profileData.traits.length === 0) && (
          <>
            {hobbies && (
              <InfoSection
                icon={Gamepad}
                title="Hobbies"
                items={hobbies.items?.map(i => i.value) || []}
                color="blue"
              />
            )}
            {likes && (
              <InfoSection
                icon={Heart}
                title="Likes"
                items={likes.items?.map(i => i.value) || []}
                color="pink"
              />
            )}
            {dislikes && (
              <InfoSection
                icon={ThumbsDown}
                title="Dislikes"
                items={dislikes.items?.map(i => i.value) || []}
                color="red"
              />
            )}
          </>
        )}

        {/* Hashtags */}
        {profileData.hashtags && (
          <motion.div
            variants={staggerItemVariants}
            className="rounded-xl bg-white/5 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Hash className="h-4 w-4 text-blue-400" />
              <h3 className="font-medium text-white">Hashtags</h3>
            </div>
            <div className="space-y-1 text-sm">
              {profileData.hashtags.general && (
                <p className="text-white/60">
                  General: <span className="text-blue-300">{profileData.hashtags.general}</span>
                </p>
              )}
              {profileData.hashtags.fanart && (
                <p className="text-white/60">
                  Fan Art: <span className="text-blue-300">{profileData.hashtags.fanart}</span>
                </p>
              )}
              {profileData.hashtags.stream && (
                <p className="text-white/60">
                  Live: <span className="text-blue-300">{profileData.hashtags.stream}</span>
                </p>
              )}
              {profileData.hashtags.fanName && (
                <p className="text-white/60">
                  Fans: <span className="text-blue-300">{profileData.hashtags.fanName}</span>
                </p>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export const AboutPage: PageContent = {
  Left: AboutLeft,
  Right: AboutRight,
}

interface InfoSectionProps {
  icon: LucideIcon
  title: string
  items: string[]
  color?: 'blue' | 'pink' | 'red'
  customColor?: string
}

const colorMap = {
  blue: 'text-blue-400',
  pink: 'text-pink-400',
  red: 'text-red-400',
}

function InfoSection({ icon: Icon, title, items, color, customColor }: InfoSectionProps) {
  const colorClass = color ? colorMap[color] : ''

  return (
    <motion.div
      variants={staggerItemVariants}
      className="rounded-xl bg-white/5 p-4"
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon
          className={cn('h-4 w-4', colorClass)}
          style={customColor ? { color: customColor } : undefined}
        />
        <h3 className="font-medium text-white">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-white/10 px-2 py-0.5 text-xs text-white/80"
          >
            {item}
          </span>
        ))}
      </div>
    </motion.div>
  )
}
