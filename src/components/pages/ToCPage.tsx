'use client'

import type { PageContent } from '@/components/layout/BookLayout'

function ToCLeft() {
  return (
    <div className="flex h-full items-center justify-center">
      <h1 className="text-4xl font-bold text-white">Welcome</h1>
    </div>
  )
}

function ToCRight() {
  return (
    <div className="flex h-full flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold text-white">Portfolio</h2>
      <p className="mt-4 text-white/60 text-center">
        Scroll to explore
      </p>
    </div>
  )
}

export const ToCPage: PageContent = {
  Left: ToCLeft,
  Right: ToCRight,
}
