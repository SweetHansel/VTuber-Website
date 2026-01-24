import { create } from 'zustand'

export type ModalType =
  | 'artwork'
  | 'blog-post'
  | 'announcement'
  | 'song'
  | 'video'
  | 'live2d-model'
  | '3d-model'
  | null

interface ModalState {
  isOpen: boolean
  modalType: ModalType
  contentId: string | null
  contentData: Record<string, unknown> | null

  // Actions
  openModal: (type: ModalType, id: string, data?: Record<string, unknown>) => void
  closeModal: () => void
  setContentData: (data: Record<string, unknown>) => void
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
    contentData: data || null
  }),

  closeModal: () => set({
    isOpen: false,
    modalType: null,
    contentId: null,
    contentData: null
  }),

  setContentData: (data) => set({ contentData: data }),
}))
