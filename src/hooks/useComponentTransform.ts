import { useLayoutStore, getComponentTransform, type ComponentId } from '@/stores/layoutStore'
import { easeIn, easeInOut, easeOut } from 'framer-motion'


// For motion.div transition prop
export const sceneSpring = { duration: 1, bounce: 0.5, ease: easeOut }


export function useComponentTransform(id: ComponentId) {
  const focusState = useLayoutStore((s) => s.focusState)
  const t = getComponentTransform(focusState, id)

  return {
    position: { x: `${t.x}%`, y: `${t.y}%`, scale: t.scale, opacity: t.opacity },
    rotation: { rotateX: t.rotateX, rotateZ: t.rotateZ },
  }
}
