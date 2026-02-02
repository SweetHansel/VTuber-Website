'use client'

import { useThemes } from '@/hooks/useCMS'
import { useEffect } from 'react'

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { data: themes } = useThemes()

  useEffect(() => {
    if (!themes) return
    const root = document.documentElement

    if (themes.primaryColor) root.style.setProperty('--primary', themes.primaryColor)
    if (themes.phoneScreenColor) root.style.setProperty('--phone-screen', themes.phoneScreenColor)
    if (themes.pageSurfaceColor) root.style.setProperty('--page-surface', themes.pageSurfaceColor)
  }, [themes])

  return <>{children}</>
}
