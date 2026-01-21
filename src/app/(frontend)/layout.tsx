'use client'

import { AudioProvider } from '@/components/audio/AudioProvider'
import { MainLayout } from '@/components/layout/MainLayout'

export default function FrontendLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AudioProvider>
      <MainLayout>{children}</MainLayout>
    </AudioProvider>
  )
}
