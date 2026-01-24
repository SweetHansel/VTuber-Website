'use client'

import type { PageContent } from '@/components/layout/BookLayout'
import { useBookStore, sections, type Section } from '@/stores/bookStore'
import { User, Image, Music, Box } from 'lucide-react'

const sectionConfig: Record<Exclude<Section, 'toc'>, { icon: typeof User; label: string }> = {
  about: { icon: User, label: 'About Me' },
  artworks: { icon: Image, label: 'Artworks' },
  discography: { icon: Music, label: 'Discography' },
  'vtuber-models': { icon: Box, label: 'VTuber Models' },
}

const navSections = sections.filter((s): s is Exclude<Section, 'toc'> => s !== 'toc')

function ToCLeft() {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-4xl font-bold text-white">Welcome</h1>
    </div>
  )
}

function ToCRight() {
  const { goToSection } = useBookStore()

  return (
    <div className="flex h-full flex-col items-center justify-center p-6">
      <h2 className="text-xl font-bold text-white mb-6">Navigate</h2>

      <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
        {navSections.map((section) => {
          const { icon: Icon, label } = sectionConfig[section]

          return (
            <button
              key={section}
              onClick={() => goToSection(section)}
              className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs">{label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

export const ToCPage: PageContent = {
  Left: ToCLeft,
  Right: ToCRight,
}
