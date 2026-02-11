import {
  useLayoutStore,
  defaultScenePresets,
  PHONE,
  BOOK,
  type ComponentId,
} from "@/stores/layoutStore";

export function useComponentTransform(id: ComponentId) {
  const focusState = useLayoutStore((s) => s.focusState);
  const scaleFactor = useLayoutStore((s) => s.scaleFactor);
  const rootDimension = useLayoutStore((s) => s.rootDimension);

  const t = defaultScenePresets[focusState][id];

  // Viewport-dependent scale overrides for focused components
  let scale = t.scale;
  if (focusState === "left" && id === "phone") {
    scale = Math.min(rootDimension.width / PHONE.width, rootDimension.height / PHONE.height) / scaleFactor;
  } else if (focusState === "bottom-right" && id === "book") {
    scale = Math.min(rootDimension.width / BOOK.width, rootDimension.height / BOOK.height) / scaleFactor;
  }

  return {
    x: t.x,
    y: t.y,
    scale,
    opacity: t.opacity,
    rotateX: t.rotateX,
    rotateZ: t.rotateZ,
  };
}
