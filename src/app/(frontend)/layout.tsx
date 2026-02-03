'use client'

import { useEffect } from 'react'
import { Geist, Geist_Mono } from 'next/font/google'
import { AudioProvider } from '@/components/audio/AudioProvider'
import { ThemeProvider } from '@/components/providers/ThemeProvider'
import { MainLayout } from '@/components/layout/MainLayout'
import { useCMSStore } from '@/stores/cmsStore'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Prefetch critical CMS data (themes + profile) before rendering
function CMSPrefetcher() {
  const prefetchCritical = useCMSStore((s) => s.prefetchCritical)

  useEffect(() => {
    prefetchCritical()
  }, [prefetchCritical])

  return null
}

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <CMSPrefetcher />
        <ThemeProvider>
          <AudioProvider>
            <MainLayout>{children}</MainLayout>
          </AudioProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
