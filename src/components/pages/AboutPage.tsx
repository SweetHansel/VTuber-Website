'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { staggerContainerVariants, staggerItemVariants } from '@/animations'
import { cn } from '@/lib/utils'
import { Heart, ThumbsDown, Gamepad, Hash, Calendar, Ruler, LucideIcon } from 'lucide-react'

// Mock profile data - will be replaced with CMS data
const profileData = {
  name: 'VTuber Name',
  japaneseName: 'ブイチューバー',
  tagline: 'Virtual Singer & Streamer',
  avatar: '/placeholder-avatar.png',
  shortBio: 'A cheerful virtual streamer who loves singing, gaming, and chatting with fans!',
  birthday: '2025-03-15',
  height: '158cm',
  hobbies: ['Singing', 'Gaming', 'Drawing', 'Cooking'],
  likes: ['Music', 'Cats', 'Strawberries', 'Anime'],
  dislikes: ['Spicy food', 'Bugs', 'Early mornings'],
  hashtags: {
    general: '#VTuberName',
    fanart: '#VTuberArt',
    stream: '#VTuberLive',
    fanName: 'VTuFans',
  },
  socialLinks: [
    { platform: 'twitter', url: 'https://twitter.com/vtuber' },
    { platform: 'youtube', url: 'https://youtube.com/@vtuber' },
    { platform: 'twitch', url: 'https://twitch.tv/vtuber' },
  ],
}

export function AboutPage() {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-6 lg:flex-row">
      {/* Left: Model Preview */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="enter"
        className="flex flex-col items-center gap-4 lg:w-1/3"
      >
        <motion.div
          variants={staggerItemVariants}
          className="relative aspect-[3/4] w-48 overflow-hidden rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 lg:w-full"
        >
          <Image
            src={profileData.avatar}
            alt={profileData.name}
            fill
            className="object-cover"
            priority
          />
        </motion.div>
        <motion.button
          variants={staggerItemVariants}
          className="rounded-full bg-white/10 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/20"
        >
          View All Models →
        </motion.button>
      </motion.div>

      {/* Right: Profile Card */}
      <motion.div
        variants={staggerContainerVariants}
        initial="initial"
        animate="enter"
        className="flex-1 space-y-6"
      >
        {/* Name & Tagline */}
        <motion.div variants={staggerItemVariants}>
          <h1 className="text-3xl font-bold text-white">{profileData.name}</h1>
          <p className="text-lg text-white/60">{profileData.japaneseName}</p>
          <p className="mt-1 text-purple-300">{profileData.tagline}</p>
        </motion.div>

        {/* Bio */}
        <motion.p variants={staggerItemVariants} className="text-white/80">
          {profileData.shortBio}
        </motion.p>

        {/* Stats */}
        <motion.div variants={staggerItemVariants} className="flex gap-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">
              {new Date(profileData.birthday).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-white/60" />
            <span className="text-sm text-white/80">{profileData.height}</span>
          </div>
        </motion.div>

        {/* Info sections */}
        <div className="grid gap-4 md:grid-cols-2">
          {/* Hobbies */}
          <InfoSection
            icon={Gamepad}
            title="Hobbies"
            items={profileData.hobbies}
            color="purple"
          />

          {/* Likes */}
          <InfoSection
            icon={Heart}
            title="Likes"
            items={profileData.likes}
            color="pink"
          />

          {/* Dislikes */}
          <InfoSection
            icon={ThumbsDown}
            title="Dislikes"
            items={profileData.dislikes}
            color="red"
          />

          {/* Hashtags */}
          <motion.div
            variants={staggerItemVariants}
            className="rounded-xl bg-white/5 p-4"
          >
            <div className="mb-2 flex items-center gap-2">
              <Hash className="h-4 w-4 text-blue-400" />
              <h3 className="font-medium text-white">Hashtags</h3>
            </div>
            <div className="space-y-1 text-sm">
              <p className="text-white/60">
                General: <span className="text-blue-300">{profileData.hashtags.general}</span>
              </p>
              <p className="text-white/60">
                Fan Art: <span className="text-blue-300">{profileData.hashtags.fanart}</span>
              </p>
              <p className="text-white/60">
                Live: <span className="text-blue-300">{profileData.hashtags.stream}</span>
              </p>
              <p className="text-white/60">
                Fans: <span className="text-blue-300">{profileData.hashtags.fanName}</span>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

interface InfoSectionProps {
  icon: LucideIcon
  title: string
  items: string[]
  color: 'purple' | 'pink' | 'red' | 'blue'
}

const colorMap = {
  purple: 'text-purple-400',
  pink: 'text-pink-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
}

function InfoSection({ icon: Icon, title, items, color }: InfoSectionProps) {
  return (
    <motion.div
      variants={staggerItemVariants}
      className="rounded-xl bg-white/5 p-4"
    >
      <div className="mb-2 flex items-center gap-2">
        <Icon className={cn('h-4 w-4', colorMap[color])} />
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
