'use client'

import { AnimatedArtwork } from './AnimatedArtwork'
import { PageContainer } from '@/components/pages/PageContainer'
import { ToC } from './ToC'
import { cn } from '@/lib/utils'

interface RightContainerProps {
  className?: string
}

export function RightContainer({ className }: RightContainerProps) {
  return (
    <div className={cn('relative flex-1', className)}>
      {/* Upper Animated Artwork */}
      <AnimatedArtwork position="right-upper" className="absolute right-8 top-8" />

      {/* ToC Navigation */}
      <ToC className="absolute right-4 top-1/2 z-20 -translate-y-1/2" />

      {/* Main Page Container */}
      <div className="relative z-10 flex h-full items-center justify-center p-4 pb-24">
        <PageContainer />
      </div>
    </div>
  )
}
