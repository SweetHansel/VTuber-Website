'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useModalStore, type ModalType } from '@/stores/modalStore'
import { X } from 'lucide-react'
import { scaleFadeVariants } from '@/animations'

export function Modal() {
  const { isOpen, modalType, contentId, contentData, closeModal } = useModalStore()

  // Close on escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
    }
    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [closeModal])

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal content */}
          <motion.div
            variants={scaleFadeVariants}
            initial="initial"
            animate="enter"
            exit="exit"
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-2xl -translate-x-1/2 -translate-y-1/2 px-4"
          >
            <div className="relative rounded-2xl bg-slate-900 p-6 shadow-2xl">
              {/* Close button */}
              <button
                onClick={closeModal}
                className="absolute right-4 top-4 rounded-full p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Content based on type */}
              <ModalContent
                type={modalType}
                id={contentId}
                data={contentData}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

interface ModalContentProps {
  type: ModalType
  id: string | null
  data: Record<string, unknown> | null
}

function ModalContent({ type, id, data }: ModalContentProps) {
  if (!data) {
    return (
      <div className="py-8 text-center text-white/60">Loading...</div>
    )
  }

  switch (type) {
    case 'announcement':
    case 'blog-post':
      return (
        <div>
          <h2 className="mb-4 text-2xl font-bold text-white">
            {String(data.title || '')}
          </h2>
          {data.excerpt ? (
            <p className="text-white/70">{String(data.excerpt)}</p>
          ) : null}
          {/* Add more content rendering */}
        </div>
      )

    case 'artwork':
      return (
        <div>
          <h2 className="mb-4 text-xl font-bold text-white">Artwork Details</h2>
          {/* Artwork modal content */}
        </div>
      )

    case 'song':
      return (
        <div>
          <h2 className="mb-4 text-xl font-bold text-white">Song Details</h2>
          {/* Song modal content */}
        </div>
      )

    default:
      return (
        <div className="py-8 text-center text-white/60">
          Content not available
        </div>
      )
  }
}
