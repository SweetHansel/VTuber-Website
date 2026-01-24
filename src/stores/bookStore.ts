import { create } from "zustand";

export const sections = [
  "toc",
  "about",
  "artworks",
  "discography",
  "vtuber-models",
] as const;

export type Section = (typeof sections)[number];

interface BookState {
  index: number;
  setIndex: (index: number | ((prev: number) => number)) => void;
  goToSection: (section: Section) => void;
  nextPage: () => void;
  prevPage: () => void;
}

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

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
