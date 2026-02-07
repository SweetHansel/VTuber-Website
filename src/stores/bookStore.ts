import { create } from "zustand";
import { BOOK_SECTIONS, type BookSection } from "@/constants/sections";
import { clamp } from "@/lib/utils";

// Re-export for backwards compatibility
export const sections = BOOK_SECTIONS;
export type Section = BookSection;

interface BookState {
  index: number;
  setIndex: (index: number | ((prev: number) => number)) => void;
  goToSection: (section: Section) => void;
  nextPage: () => void;
  prevPage: () => void;
}

export const useBookStore = create<BookState>((set) => ({
  index: 1,

  setIndex: (indexOrFn) =>
    set((state) => ({
      index: clamp(
        typeof indexOrFn === "function" ? indexOrFn(state.index) : indexOrFn,
        1,
        sections.length
      ),
    })),

  goToSection: (section) =>
    set({ index: sections.indexOf(section) + 1 }),

  nextPage: () =>
    set((state) => ({
      index: Math.min(Math.round(state.index) + 1, sections.length),
    })),

  prevPage: () =>
    set((state) => ({
      index: Math.max(Math.round(state.index) - 1, 1),
    })),
}));
