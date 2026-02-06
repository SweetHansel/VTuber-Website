import { create } from 'zustand'
import type { Artwork, Post, MusicTrack, Video, Model, Person } from '@/payload-types'

// Map modal types to their data types
export interface ModalDataMap {
  artwork: Artwork
  post: Post
  song: MusicTrack
  video: Video
  model: Model
  person: Person
}

export type ModalType = keyof ModalDataMap | null

// Discriminated union for type-safe modal content
export type ModalContent =
  | { type: 'artwork'; data: Artwork }
  | { type: 'post'; data: Post }
  | { type: 'song'; data: MusicTrack }
  | { type: 'video'; data: Video }
  | { type: 'model'; data: Model }
  | { type: 'person'; data: Person }
  | { type: null; data: null }

interface ModalState {
  isOpen: boolean
  modalType: ModalType
  contentId: string | null
  contentData: ModalDataMap[keyof ModalDataMap] | null

  // Type-safe openModal with proper type-data pairing
  openModal: <T extends keyof ModalDataMap>(
    type: T,
    id: string,
    data: ModalDataMap[T]
  ) => void
  closeModal: () => void
}

export const useModalStore = create<ModalState>((set) => ({
  isOpen: false,
  modalType: null,
  contentId: null,
  contentData: null,

  openModal: (type, id, data) => set({
    isOpen: true,
    modalType: type,
    contentId: id,
    contentData: data,
  }),

  closeModal: () => set({
    isOpen: false,
    modalType: null,
    contentId: null,
    contentData: null,
  }),
}))
