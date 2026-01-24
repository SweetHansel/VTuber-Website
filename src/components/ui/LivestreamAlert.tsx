'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useLivestreamStore, getPrimaryStream } from '@/stores/livestreamStore'
import { cn } from '@/lib/utils'
import { Radio, X, ExternalLink, Users } from 'lucide-react'

export function LivestreamAlert() {
  const { streams, showAlert, dismissStream, hideAlertBanner } = useLivestreamStore()

  const primaryStream = getPrimaryStream(streams.filter(s => showAlert))

  // Auto-poll for livestream status
  useEffect(() => {
    const checkLiveStatus = async () => {
      try {
        const res = await fetch('/api/livestream/status')
        if (res.ok) {
          const data = await res.json()
          useLivestreamStore.getState().setStreams(data.streams || [])
          useLivestreamStore.getState().setLastChecked(new Date())
        }
      } catch (error) {
        console.error('Failed to check livestream status:', error)
      }
    }

    // Initial check
    checkLiveStatus()

    // Poll every 60 seconds
    const interval = setInterval(checkLiveStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  if (!primaryStream) return null

  return (
    <AnimatePresence>
      {showAlert && (
        <motion.div
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: 100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          className={cn(
            'fixed z-50 overflow-hidden rounded-xl shadow-2xl',
            'bottom-24 right-4 w-72 md:bottom-20 md:w-80'
          )}
        >
          {/* Background with gradient */}
          <div className="relative bg-gradient-to-br from-red-600 to-blue-600 p-0.5">
            <div className="relative bg-slate-900 p-3">
              {/* Close button */}
              <button
                onClick={() => dismissStream(primaryStream.channelId)}
                className="absolute right-2 top-2 rounded-full p-1 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Live indicator */}
              <div className="mb-2 flex items-center gap-2">
                <span className="flex items-center gap-1">
                  <Radio className="h-4 w-4 animate-pulse text-red-500" />
                  <span className="text-xs font-bold uppercase text-red-500">
                    Live
                  </span>
                </span>
                <span className="text-xs capitalize text-white/60">
                  on {primaryStream.platform}
                </span>
              </div>

              {/* Thumbnail */}
              {primaryStream.thumbnail && (
                <div className="relative mb-2 aspect-video overflow-hidden rounded-lg">
                  <Image
                    src={primaryStream.thumbnail}
                    alt={primaryStream.title}
                    fill
                    className="object-cover"
                  />
                  {/* Viewer count overlay */}
                  {primaryStream.viewerCount !== undefined && (
                    <div className="absolute bottom-1 right-1 flex items-center gap-1 rounded bg-black/70 px-1.5 py-0.5 text-xs text-white">
                      <Users className="h-3 w-3" />
                      {primaryStream.viewerCount.toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Stream info */}
              <h3 className="mb-1 line-clamp-2 text-sm font-medium text-white">
                {primaryStream.title}
              </h3>
              <p className="mb-3 text-xs text-white/60">
                {primaryStream.channelName}
                {!primaryStream.isOwner && ' (Friend)'}
              </p>

              {/* Watch button */}
              <a
                href={primaryStream.streamUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-600 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
              >
                <ExternalLink className="h-4 w-4" />
                Watch Now
              </a>
            </div>
          </div>

          {/* Pulse animation */}
          <motion.div
            className="absolute inset-0 rounded-xl border-2 border-red-500"
            animate={{
              opacity: [0.5, 0, 0.5],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
