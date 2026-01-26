"use client";

import { ReactNode, useRef, useState, useEffect, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type AnchorX = "left" | "center" | "right";
type AnchorY = "top" | "center" | "bottom";

interface AspectLockProps {
  children: ReactNode;
  aspectRatio: number; // width / height (e.g., 16/9 = 1.78, 3/4 = 0.75)
  anchorX?: AnchorX;
  anchorY?: AnchorY;
  off?: boolean;
  className?: string;
}

// Calculate dimensions that fit aspect ratio within given bounds
function calculateDimensions(
  parentWidth: number,
  parentHeight: number,
  aspectRatio: number
) {
  const parentRatio = parentWidth / parentHeight;
  if (parentRatio > aspectRatio) {
    const height = parentHeight;
    const width = height * aspectRatio;
    return { width, height };
  } else {
    const width = parentWidth;
    const height = width / aspectRatio;
    return { width, height };
  }
}

export function AspectLock({
  children,
  aspectRatio,
  anchorX = "left",
  anchorY = "top",
  off = false,
  className,
}: AspectLockProps) {
  const parentRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isReady, setIsReady] = useState(false);
  const lastDimensionsRef = useRef({ width: 0, height: 0 });

  // Immediate calculation on mount (before paint)
  useLayoutEffect(() => {
    if (off) return;
    const parent = parentRef.current?.parentElement;
    if (!parent) return;

    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;
    if (parentWidth < 100 || parentHeight < 100) return;

    const dims = calculateDimensions(parentWidth, parentHeight, aspectRatio);
    lastDimensionsRef.current = dims;
    setDimensions(dims);
    setIsReady(true);
  }, [aspectRatio, off]);

  // ResizeObserver for ongoing updates
  useEffect(() => {
    if (off) return;
    const parent = parentRef.current?.parentElement;
    if (!parent) return;

    let debounceTimer: NodeJS.Timeout | null = null;

    const updateDimensions = () => {
      const parentWidth = parent.clientWidth;
      const parentHeight = parent.clientHeight;

      const minSize = 100;
      if (parentWidth < minSize || parentHeight < minSize) return;

      const { width, height } = calculateDimensions(parentWidth, parentHeight, aspectRatio);

      if (
        Math.abs(width - lastDimensionsRef.current.width) > 1 ||
        Math.abs(height - lastDimensionsRef.current.height) > 1
      ) {
        lastDimensionsRef.current = { width, height };
        setDimensions({ width, height });
      }
    };

    const debouncedUpdate = () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateDimensions, 50);
    };

    const resizeObserver = new ResizeObserver(debouncedUpdate);
    resizeObserver.observe(parent);

    return () => {
      if (debounceTimer) clearTimeout(debounceTimer);
      resizeObserver.disconnect();
    };
  }, [aspectRatio, off]);

  // Map anchors to flexbox alignment
  const justifyMap: Record<AnchorX, string> = {
    left: "justify-start",
    center: "justify-center",
    right: "justify-end",
  };

  const alignMap: Record<AnchorY, string> = {
    top: "items-start",
    center: "items-center",
    bottom: "items-end",
  };

  return (
    <div
      ref={parentRef}
      className={cn(
        "pointer-events-none absolute inset-0 flex",
        justifyMap[anchorX],
        alignMap[anchorY]
      )}
    >
      <motion.div
        className={cn("pointer-events-auto", className)}
        style={{
          width: off || !isReady ? "100%" : dimensions.width,
          height: off || !isReady ? "100%" : dimensions.height,
        }}
        initial={false}
        animate={{
          width: off || !isReady ? "100%" : dimensions.width,
          height: off || !isReady ? "100%" : dimensions.height,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
