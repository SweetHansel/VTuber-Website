import { create } from "zustand";

export type FocusState = "default" | "left" | "bottom-right"|"no-item";
export type ComponentId = "book" | "phone" | "media";

interface ComponentTransform {
  x: number; // %
  y: number; // %
  scale: number;
  rotateX: number; // degrees
  rotateZ: number; // degrees
  opacity: number;
}

interface GroupTransform {
  x: number; // %
  y: number; // %
  scale: number;
}

interface SceneConfig {
  group: GroupTransform;
  components: Record<ComponentId, ComponentTransform>;
}

interface LayoutState {
  focusState: FocusState;
  isTransitioning: boolean;

  // Actions
  setFocus: (state: FocusState) => void;
  setTransitioning: (isTransitioning: boolean) => void;
  goBack: () => void;
}

// Scene presets per focus state — tweak values here to adjust layout
export const scenePresets: Record<FocusState, SceneConfig> = {
  "no-item": {
    group: { x: 0, y: 0, scale: 1 },
    components: {
      phone: { x: -150, y: 0, scale: 0.8, rotateX: 0, rotateZ: 0, opacity: 1 },
      media: { x: 15, y: -150, scale: 0.5, rotateX: 0, rotateZ: 0, opacity: 1 },
      book: { x: 10, y: 150, scale: 0.75, rotateX: 0, rotateZ: 0, opacity: 1 },
    },
  },
  default: {
    group: { x: 0, y: 0, scale: 1 }, 
    components: {
      phone: { x: -25, y: 0, scale: 0.8, rotateX: 8, rotateZ: -1, opacity: 1 },
      media: { x: 15, y: -25, scale: 0.5, rotateX: 0, rotateZ: 0, opacity: 1 },
      book: { x: 10, y: 25, scale: 0.75, rotateX: 11, rotateZ: -6, opacity: 1 },
    },
  },
  left: {
    group: { x: 31.25, y: 0, scale: 1.25 },
    components: {
      phone: { x: -25, y: 0, scale: 0.8, rotateX: 0, rotateZ: 0, opacity: 1 },
      media: { x: 115, y: -125, scale: 0.5, rotateX: 0, rotateZ: 0, opacity: 1 },
      book: { x: 110, y: 125, scale: 0.75, rotateX: 11, rotateZ: -6, opacity: 1 },
    },
  },
  "bottom-right": {
    group: { x: -44/3, y: -100/3, scale: 4/3 },
    components: {
      phone: { x: -125, y: 0, scale: 0.8, rotateX: 8, rotateZ: -1, opacity: 1 },
      media: { x: 115, y: -125, scale: 0.5, rotateX: 0, rotateZ: 0, opacity: 1 },
      book: { x: 10, y: 25, scale: 0.75, rotateX: 0, rotateZ: 0, opacity: 1 },
    },
  },
};

// Compose group + local into final world-space transform
export function getComponentTransform(
  focusState: FocusState,
  id: ComponentId,
): ComponentTransform {
  const { group, components } = scenePresets[focusState];
  const local = components[id];

  return {
    x: group.x + local.x * group.scale,
    y: group.y + local.y * group.scale,
    scale: group.scale * local.scale,
    rotateX: local.rotateX,
    rotateZ: local.rotateZ,
    opacity: local.opacity,
  };
}

export const useLayoutStore = create<LayoutState>((set, get) => ({
  focusState: "no-item",
  isTransitioning: false,

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

  setTransitioning: (isTransitioning) => set({ isTransitioning }),

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
