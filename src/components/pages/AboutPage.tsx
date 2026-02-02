'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { staggerContainerVariants, staggerItemVariants } from '@/animations'
import { cn } from '@/lib/utils'
import { Heart, ThumbsDown, Gamepad, Hash, Calendar, Ruler, LucideIcon, Star, Music, Sparkles, Coffee, Loader2 } from 'lucide-react'
import type { PageContent } from '@/components/layout/BookLayout'
import { useProfile, type Profile, getModel, getMedia, nullToUndefined } from '@/hooks/useCMS'
import { ModelShowcase } from '../models/ModelShowcase'

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
      <ModelShowcase model={getModel(profile?.currentModel)} />
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

  if (loading) {
    return <LoadingSkeleton />
  }

  if (!profile) {
    return <div className="flex h-full items-center justify-center text-white/60">Profile not found</div>
  }

  // Get the current model from union type
  const currentModel = getModel(profile.currentModel)

  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="initial"
      animate="enter"
      className="h-full space-y-6 overflow-y-auto p-6"
    >

      <motion.div variants={staggerItemVariants}>
        {currentModel?.refSheets?.map((v, i) => {
          const media = getMedia(v.media)
          if (!media?.url) return null
          return <Image key={media.id ?? i} alt={media.alt ?? v.label ?? ''} src={media.url} width={200} height={200} />
        })}
      </motion.div>

      {/* Name & Tagline */}
      <motion.div variants={staggerItemVariants}>
        <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
        {profile.alternateName && (
          <p className="text-lg text-white/60">{profile.alternateName}</p>
        )}
        {profile.tagline && (
          <p className="mt-1 text-primary">{profile.tagline}</p>
        )}
      </motion.div>

      {/* Bio */}
      {profile.shortBio && (
        <motion.p variants={staggerItemVariants} className="text-white/80">
          {profile.shortBio}
        </motion.p>
      )}

      {/* Stats */}
      <motion.div variants={staggerItemVariants} className="flex gap-6">
        {profile.birthday && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">
              {new Date(profile.birthday).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
        )}
        {profile.height && (
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">{profile.height}</span>
          </div>
        )}
      </motion.div>

      {/* Info sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Dynamic traits from CMS */}
        {profile.traits?.map((trait) => {
          const IconComponent = iconMap[trait.icon || 'Star'] || Star
          const items = trait.items?.map(i => i.value) || []
          return (
            <InfoSection
              key={trait.category}
              icon={IconComponent}
              title={trait.category}
              items={items}
              customColor={nullToUndefined(trait.color)}
            />
          )
        })}

        {/* Hashtags */}
        {profile.hashtags && profile.hashtags.length > 0 && (
          <motion.div
            variants={staggerItemVariants}
            className="rounded-xl bg-white/5 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Hash className="h-4 w-4 text-primary" />
              <h3 className="font-medium text-white">Hashtags</h3>
            </div>
            <div className="space-y-1 text-sm">
              {profile.hashtags.map((hashtag) => (
                <p key={hashtag.label} className="text-white/60">
                  {hashtag.label}: <span className="text-primary">{hashtag.value}</span>
                </p>
              ))}
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

function InfoSection({ icon: Icon, title, items, color, customColor }: Readonly<InfoSectionProps>) {
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
