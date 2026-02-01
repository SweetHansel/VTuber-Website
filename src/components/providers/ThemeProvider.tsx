'use client'

import { useThemes } from '@/hooks/useCMS'
import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: themes } = useThemes()

  useEffect(() => {
    if (!themes) return
    const root = document.documentElement

    // Base colors
    if (themes.backgroundColor) root.style.setProperty('--background', themes.backgroundColor)
    if (themes.foregroundColor) root.style.setProperty('--foreground', themes.foregroundColor)

    // Brand colors
    if (themes.primaryColor) root.style.setProperty('--primary', themes.primaryColor)
    if (themes.primaryHoverColor) root.style.setProperty('--primary-hover', themes.primaryHoverColor)
    if (themes.secondaryColor) root.style.setProperty('--secondary', themes.secondaryColor)
    if (themes.accentColor) root.style.setProperty('--accent', themes.accentColor)

    // Surface colors
    if (themes.bgPrimaryColor) root.style.setProperty('--bg-primary', themes.bgPrimaryColor)
    if (themes.bgSurfaceColor) root.style.setProperty('--bg-surface', themes.bgSurfaceColor)
  }, [themes])

  return <>{children}</>
}
