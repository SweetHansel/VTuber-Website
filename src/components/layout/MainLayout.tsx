'use client'

import { ReactNode } from 'react'
import { LeftBar } from './LeftBar'
import { RightContainer } from './RightContainer'
import { LeftContainer } from './LeftContainer'
import { SongSeekbar } from '@/components/audio/SongSeekbar'
import { LivestreamAlert } from '@/components/ui/LivestreamAlert'
import { Modal } from '@/components/content/Modal'

interface MainLayoutProps {
  children?: ReactNode
}

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Left Navigation Bar */}
      <LeftBar />

      {/* Main Content Area */}
      <div className="flex min-h-screen pl-16 md:pl-20">
        {/* Left Container - Content List (Announcements + Blogs) */}
        <LeftContainer className="hidden lg:flex" />

        {/* Right Container - Main Pages */}
        <RightContainer />
      </div>

      {/* Global Audio Player */}
      <SongSeekbar />

      {/* Livestream Alert */}
      <LivestreamAlert />

      {/* Modal */}
      <Modal />
    </div>
  )
}
