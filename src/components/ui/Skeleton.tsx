'use client'

import { cn } from '@/lib/utils'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-white/10',
        className
      )}
    />
  )
}

// Common skeleton patterns
export function CardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white/5 p-3">
      <Skeleton className="mb-3 aspect-video w-full" />
      <Skeleton className="mb-2 h-4 w-3/4" />
      <Skeleton className="h-3 w-1/2" />
    </div>
  )
}

export function SongCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-xl bg-white/5">
      <Skeleton className="aspect-square w-full" />
      <div className="p-3">
        <Skeleton className="mb-2 h-4 w-3/4" />
        <Skeleton className="h-3 w-1/2" />
      </div>
    </div>
  )
}

export function ProfileSkeleton() {
  return (
    <div className="flex gap-6">
      <Skeleton className="h-64 w-48 rounded-2xl" />
      <div className="flex-1 space-y-4">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-4 w-1/4" />
        <Skeleton className="h-20 w-full" />
        <div className="grid grid-cols-2 gap-4">
          <Skeleton className="h-32 rounded-xl" />
          <Skeleton className="h-32 rounded-xl" />
        </div>
      </div>
    </div>
  )
}
