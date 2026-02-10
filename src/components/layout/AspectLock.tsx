"use client";

import { ReactNode, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";
import { animate, motion, useMotionValue, useTransform } from "framer-motion";
import { sceneSpring } from "@/hooks/useComponentTransform";

interface AspectLockProps {
  children: ReactNode;
  aspectRatio: number;
  off?: boolean;
  className?: string;
}

export function AspectLock({
  children,
  aspectRatio,
  off = false,
  className,
}: AspectLockProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentW = useMotionValue(1920);
  const parentH = useMotionValue(1080);
  const offAnimated = useMotionValue(off ? 1 : 0);

  useEffect(() => {
    const controls = animate(offAnimated, off ? 1 : 0, {
      duration: sceneSpring.duration,
      ease: sceneSpring.ease,
    });
    return () => controls.stop();
  }, [off]);

  useEffect(() => {
    const parent = containerRef.current?.parentElement;
    if (!parent) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) {
        parentW.set(width);
        parentH.set(height);
      }
    });

    observer.observe(parent);
    return () => observer.disconnect();
  }, [parentW, parentH]);

  const width = useTransform(() => {
    const t = offAnimated.get();
    const pw = parentW.get();
    const ph = parentH.get();
    const constrained = pw / ph > aspectRatio ? ph * aspectRatio : pw;
    return constrained + (pw - constrained) * t;
  });

  const height = useTransform(() => {
    const t = offAnimated.get();
    const pw = parentW.get();
    const ph = parentH.get();
    const constrained = pw / ph > aspectRatio ? ph : pw / aspectRatio;
    return constrained + (ph - constrained) * t;
  });

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex pointer-events-none justify-center items-center"
    >
      <motion.div
        className={cn("pointer-events-auto", className)}
        style={{ width, height }}
      >
        {children}
      </motion.div>
    </div>
  );
}
