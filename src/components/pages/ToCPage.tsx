'use client'

import type { PageContent } from '@/components/layout/BookLayout'
import { useBookStore, sections, type Section } from '@/stores/bookStore'

const sectionLabels: Record<Exclude<Section, 'toc'>, string> = {
  about: 'About Me',
  artworks: 'Artworks',
  discography: 'Discography',
  'vtuber-models': 'VTuber Models',
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
    <div className="flex h-full flex-col justify-center p-8">
      <ul className="space-y-2">
        {navSections.map((section) => (
          <li key={section}>
            <button
              onClick={() => goToSection(section)}
              className="text-white/70 hover:text-white transition-colors text-left"
            >
              {sectionLabels[section]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

export const ToCPage: PageContent = {
  Left: ToCLeft,
  Right: ToCRight,
}
