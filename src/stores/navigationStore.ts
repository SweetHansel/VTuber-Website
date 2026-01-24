import { create } from 'zustand'

export type Section = 'toc' | 'about' | 'artworks' | 'discography' | 'vtuber-models'

interface NavigationState {
  currentSection: Section
  previousSection: Section | null
  isTransitioning: boolean
  scrollDirection: 'up' | 'down' | null

  // Actions
  setSection: (section: Section) => void
  setTransitioning: (isTransitioning: boolean) => void
  setScrollDirection: (direction: 'up' | 'down' | null) => void
}

const sections: Section[] = ['toc', 'about', 'artworks', 'discography', 'vtuber-models']

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentSection: 'toc',
  previousSection: null,
  isTransitioning: false,
  scrollDirection: null,

  setSection: (section) => {
    const { currentSection, isTransitioning } = get()
    if (section === currentSection || isTransitioning) return

    const currentIndex = sections.indexOf(currentSection)
    const newIndex = sections.indexOf(section)
    const direction = newIndex > currentIndex ? 'down' : 'up'

    set({
      previousSection: currentSection,
      currentSection: section,
      scrollDirection: direction,
      isTransitioning: true
    })
  },

  setTransitioning: (isTransitioning) => set({ isTransitioning }),
  setScrollDirection: (direction) => set({ scrollDirection: direction }),
}))

export { sections }
