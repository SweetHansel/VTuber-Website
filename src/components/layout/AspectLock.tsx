"use client";

import { ReactNode, useRef, useState, useEffect } from "react";
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
  const lastDimensionsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    if (!off) {
      const parent = parentRef.current?.parentElement;
      if (!parent) return;

      let debounceTimer: NodeJS.Timeout | null = null;

      const updateDimensions = () => {
        const parentWidth = parent.clientWidth;
        const parentHeight = parent.clientHeight;

        // Don't resize if parent is collapsed or too small
        const minSize = 100;
        if (parentWidth < minSize || parentHeight < minSize) return;

        const parentRatio = parentWidth / parentHeight;

        let width: number;
        let height: number;

        if (parentRatio > aspectRatio) {
          // Parent is wider than aspect ratio - constrain by height
          height = parentHeight;
          width = height * aspectRatio;
        } else {
          // Parent is taller than aspect ratio - constrain by width
          width = parentWidth;
          height = width / aspectRatio;
        }

        // Only update if dimensions actually changed
        if (
          Math.abs(width - lastDimensionsRef.current.width) > 1 ||
          Math.abs(height - lastDimensionsRef.current.height) > 1
        ) {
          console.log("width:", width);
          console.log("height:", height);
          lastDimensionsRef.current = { width, height };
          setDimensions({ width, height });
        }
      };

      const debouncedUpdate = () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        debounceTimer = setTimeout(updateDimensions, 100);
      };

      // Initial calculation (debounced)
      debouncedUpdate();

      // Use ResizeObserver for parent size changes
      const resizeObserver = new ResizeObserver(debouncedUpdate);
      resizeObserver.observe(parent);

      return () => {
        if (debounceTimer) clearTimeout(debounceTimer);
        resizeObserver.disconnect();
      };
    }
  }, [aspectRatio, off]);

  // Calculate position styles based on anchor
  const positionStyles: React.CSSProperties = {
    position: "absolute",
  };

  // X positioning
  if (anchorX === "left") {
    positionStyles.left = 0;
  } else if (anchorX === "right") {
    positionStyles.right = 0;
  } else {
    positionStyles.left = "50%";
    positionStyles.translateX = "-50%";
  }

  // Y positioning
  if (anchorY === "top") {
    positionStyles.top = 0;
  } else if (anchorY === "bottom") {
    positionStyles.bottom = 0;
  } else {
    positionStyles.top = "50%";
    positionStyles.translateY = "-50%";
  }

  // Build transform string
  const transforms: string[] = [];
  if (positionStyles.translateX)
    transforms.push(`translateX(${positionStyles.translateX})`);
  if (positionStyles.translateY)
    transforms.push(`translateY(${positionStyles.translateY})`);
  if (transforms.length > 0) {
    positionStyles.transform = transforms.join(" ");
  }
  delete positionStyles.translateX;
  delete positionStyles.translateY;

  return (
    <div ref={parentRef} className="pointer-events-none absolute inset-0">
      <motion.div
        className={cn("pointer-events-auto perspective-1000", className)}
        style={{
          ...positionStyles,
          width: off ? "100%" : dimensions.width,
          height: off ? "100%" : dimensions.height,
        }}
        animate={{
          width: off ? "100%" : dimensions.width,
          height: off ? "100%" : dimensions.height,
        }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        {children}
      </motion.div>
    </div>
  );
}
