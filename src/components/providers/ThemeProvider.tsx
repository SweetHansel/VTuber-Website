'use client'

import { useThemes } from '@/hooks/useCMS'
import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: themes } = useThemes()

  useEffect(() => {
    if (!themes) return
    const root = document.documentElement
    if (themes.primaryColor) root.style.setProperty('--primary', themes.primaryColor)
    if (themes.secondaryColor) root.style.setProperty('--secondary', themes.secondaryColor)
    if (themes.accentColor) root.style.setProperty('--accent', themes.accentColor)
  }, [themes])

  return <>{children}</>
}
