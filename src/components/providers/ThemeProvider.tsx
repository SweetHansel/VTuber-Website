'use client'

import { useThemes } from '@/hooks/useCMS'
import { useEffect } from 'react'

export function ThemeProvider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { data: themes } = useThemes()

  useEffect(() => {
    if (!themes) return
    const root = document.documentElement

    // Phone colors
    if (themes.phoneBg) root.style.setProperty('--phone-bg', themes.phoneBg)
    if (themes.phoneText) root.style.setProperty('--phone-text', themes.phoneText)
    if (themes.phoneSurface) root.style.setProperty('--phone-surface', themes.phoneSurface)
    if (themes.phonePrimary) root.style.setProperty('--phone-primary', themes.phonePrimary)

    // Page colors
    if (themes.pageBg) root.style.setProperty('--page-bg', themes.pageBg)
    if (themes.pageText) root.style.setProperty('--page-text', themes.pageText)
    if (themes.pageSurface) root.style.setProperty('--page-surface', themes.pageSurface)
    if (themes.pagePrimary) root.style.setProperty('--page-primary', themes.pagePrimary)

    // Modal colors
    if (themes.modalBg) root.style.setProperty('--modal-bg', themes.modalBg)
    if (themes.modalText) root.style.setProperty('--modal-text', themes.modalText)
    if (themes.modalSurface) root.style.setProperty('--modal-surface', themes.modalSurface)
    if (themes.modalPrimary) root.style.setProperty('--modal-primary', themes.modalPrimary)
  }, [themes])

  return <>{children}</>
}
