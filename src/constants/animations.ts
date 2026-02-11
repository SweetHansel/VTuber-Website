import type { Variants } from "framer-motion";
import { circInOut } from "framer-motion";

export const sceneSpring = { duration: 0.8, ease: circInOut };

export const fadeVariants: Variants = {
  initial: { opacity: 0 },
  enter: { opacity: 1, transition: { duration: 0.4, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.4, ease: "easeIn" } },
};

// custom: { amplitude?, duration?, delay? }
export const idleFloat: Variants = {
  idle: (
    custom: { amplitude?: number; duration?: number; delay?: number } = {},
  ) => ({
    y: [-1, 1, -1].map((v) => v * 1 * -(custom.amplitude ?? 8)),
    rotateX: [-1, 1, -1].map((v) => v * 0.2 * -(custom.amplitude ?? 8)),
    transition: {
      duration: custom.duration ?? 4,
      delay: custom.delay ?? 0,
      repeat: Infinity,
      ease: "easeInOut",
    },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.04 } },
};

export const staggerItem: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};
