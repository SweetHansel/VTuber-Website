'use client'

import Image from 'next/image'
import { ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getInitials, getAvatarColor } from '@/lib/people'
import { getMedia, getSocial, type Social } from '@/hooks/useCMS'
import type { Person } from '@/payload-types'

interface PersonModalProps {
  data: Person
}

const PLATFORM_CONFIG: Record<string, { color: string; label: string }> = {
  twitter: { color: 'bg-sky-500/20 text-sky-300 hover:bg-sky-500/30', label: 'Twitter/X' },
  bluesky: { color: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30', label: 'Bluesky' },
  youtube: { color: 'bg-red-500/20 text-red-300 hover:bg-red-500/30', label: 'YouTube' },
  twitch: { color: 'bg-purple-500/20 text-purple-300 hover:bg-purple-500/30', label: 'Twitch' },
  instagram: { color: 'bg-pink-500/20 text-pink-300 hover:bg-pink-500/30', label: 'Instagram' },
  tiktok: { color: 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30', label: 'TikTok' },
  pixiv: { color: 'bg-blue-500/20 text-blue-300 hover:bg-blue-500/30', label: 'Pixiv' },
  vgen: { color: 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30', label: 'VGen' },
  website: { color: 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30', label: 'Website' },
  other: { color: 'bg-gray-500/20 text-gray-300 hover:bg-gray-500/30', label: 'Link' },
}

export function PersonModalContent({ data }: Readonly<PersonModalProps>) {
  const avatar = getMedia(data.avatar)
  const socials = data.socials?.map(getSocial).filter((s): s is Social => !!s) || []

  const name = data.name || 'Unknown'
  const hasAvatar = avatar?.url
  const initials = getInitials(name)
  const bgColor = getAvatarColor(name)

  return (
    <div className="flex flex-col items-center text-center">
      {/* Avatar */}
      <div
        className="relative mb-4 flex h-24 w-24 items-center justify-center rounded-full text-2xl font-bold text-white"
        style={{ backgroundColor: hasAvatar ? undefined : bgColor }}
      >
        {hasAvatar ? (
          <Image
            src={avatar.url!}
            alt={name}
            width={96}
            height={96}
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          initials
        )}
      </div>

      {/* Name */}
      <h2 className="mb-1 text-2xl font-bold text-(--modal-text)">{name}</h2>

      {/* Roles */}
      {data.roles && (
        <p className="mb-4 text-(--modal-text)/60">{data.roles}</p>
      )}

      {/* Bio */}
      {data.bio && (
        <p className="mb-6 max-w-md text-(--modal-text)/70 leading-relaxed">{data.bio}</p>
      )}

      {/* Social Links */}
      {socials.length > 0 && (
        <div className="w-full">
          <p className="mb-3 text-sm text-(--modal-text)/40">Links</p>
          <div className="flex flex-wrap justify-center gap-2">
            {socials.map((social) => {
              const config = PLATFORM_CONFIG[social.platform] || PLATFORM_CONFIG.other
              return (
                <a
                  key={social.id}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-colors',
                    config.color,
                  )}
                >
                  {social.name || config.label}
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
