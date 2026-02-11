import { create } from "zustand";

export type FocusState = "default" | "left" | "bottom-right" | "no-item";
export type ComponentId = "book" | "phone" | "media";

// Reference dimensions (fixed pixel space, scaled via CSS transform)
export const SCENE = { width: 1440, height: 1080 } as const;
export const BOOK = { width: 1920, height: 1080 } as const;
export const PHONE = { width: 720, height: 1280 } as const;

export interface ComponentTransform {
  x: number; // px
  y: number; // px
  scale: number;
  rotateX: number; // degrees
  rotateZ: number; // degrees
  opacity: number;
}

interface LayoutState {
  focusState: FocusState;
  isTransitioning: boolean;
  scaleFactor: number;
  rootDimension: { width: number; height: number };

  // Actions
  setFocus: (state: FocusState) => void;
  setRootDimension: (parentDimension: {
    width: number;
    height: number;
  }) => void;
  goBack: () => void;
}

// Default scene presets per focus state — values in px (reference: 1440×1080)
export const defaultScenePresets: Record<FocusState, Record<ComponentId, ComponentTransform>> = {
  "no-item": {
    phone: { x: -1.5 * SCENE.width, y: 0, scale: 0.8, rotateX: 2, rotateZ: -1, opacity: 1 },
    media: { x: 1.5 * SCENE.width, y: -1.5 * SCENE.height, scale: 0.5, rotateX: 0, rotateZ: 0, opacity: 1 },
    book:  { x: 1.5 * SCENE.width, y: 1.5 * SCENE.height, scale: 0.6, rotateX: 11, rotateZ: -8, opacity: 1 },
  },
  default: {
    phone: { x: -0.25 * SCENE.width, y: 0, scale: 0.8, rotateX: 2, rotateZ: -1, opacity: 1 },
    media: { x: 0.15 * SCENE.width, y: -0.25 * SCENE.height, scale: 0.5, rotateX: 0, rotateZ: 0, opacity: 1 },
    book:  { x: 0.1 * SCENE.width, y: 0.25 * SCENE.height, scale: 0.6, rotateX: 11, rotateZ: -8, opacity: 1 },
  },
  left: {
    phone: { x: 0, y: 0, scale: 1, rotateX: 0, rotateZ: 0, opacity: 1 },
    media: { x: 1.55 * SCENE.width, y: -0.25 * SCENE.height, scale: 0.5, rotateX: 0, rotateZ: 0, opacity: 0.1 },
    book:  { x: 1.5 * SCENE.width, y: 0.25 * SCENE.height, scale: 0.6, rotateX: 11, rotateZ: -8, opacity: 0.1 },
  },
  "bottom-right": {
    phone: { x: -1.5 * SCENE.width, y: 0, scale: 0.5, rotateX: 2, rotateZ: -1, opacity: 0.1 },
    media: { x: 0.15 * SCENE.width, y: -1.5 * SCENE.height, scale: 0.5, rotateX: 0, rotateZ: 0, opacity: 0.1 },
    book:  { x: 0, y: 0, scale: 1, rotateX: 0, rotateZ: 0, opacity: 1 },
  },
};

export const useLayoutStore = create<LayoutState>((set, get) => ({
  focusState: "default",
  scaleFactor: 1,
  isTransitioning: false,
  rootDimension: { width: 1920, height: 1080 },

  setFocus: (state) => {
    const { focusState, isTransitioning } = get();
    if (state === focusState || isTransitioning) return;

    set({
      focusState: state,
      isTransitioning: true,
    });

    // Auto-complete transition after animation
    setTimeout(() => {
      set({ isTransitioning: false });
    }, 500);
  },

  setRootDimension: (rootDimension) => {
    const scaleFactor = Math.min(
      rootDimension.width / SCENE.width,
      rootDimension.height / SCENE.height,
    );
    set({ rootDimension, scaleFactor });
  },

  goBack: () => {
    const { focusState, isTransitioning } = get();
    if (focusState === "default" || isTransitioning) return;

    set({
      focusState: "default",
      isTransitioning: true,
    });

    setTimeout(() => {
      set({ isTransitioning: false });
    }, 500);
  },
}));
