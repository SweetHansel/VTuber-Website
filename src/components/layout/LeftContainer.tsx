'use client'

import { Container2_5D } from './Container2_5D'
import { ContentList } from '@/components/content/ContentList'
import { cn } from '@/lib/utils'

interface LeftContainerProps {
  className?: string
}

export function LeftContainer({ className }: LeftContainerProps) {
  return (
    <div className={cn('relative z-40 w-80 shrink-0 p-4 xl:w-96', className)}>
      <Container2_5D
        className="h-full"
        rotateXRange={[-3, 3]}
        rotateYRange={[-3, 3]}
      >
        <div className="flex h-full flex-col rounded-2xl bg-black/30 p-4 backdrop-blur-lg">
          <h2 className="mb-4 text-lg font-semibold text-white">Updates</h2>
          <ContentList />
        </div>
      </Container2_5D>
    </div>
  )
}
