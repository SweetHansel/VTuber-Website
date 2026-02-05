"use client";

import { useRef, forwardRef, type ComponentProps } from "react";
import { cn } from "@/lib/utils";

interface ScrollContainerProps extends ComponentProps<"div"> {
  /** Additional threshold in pixels before considering "at boundary" */
  threshold?: number;
}

/**
 * A scrollable container that prevents wheel events from bubbling
 * when not at scroll boundaries. Use this inside BookLayout pages
 * to prevent page turning while scrolling content.
 */
export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(
  ({ className, threshold = 1, onWheel, children, ...props }, forwardedRef) => {
    const internalRef = useRef<HTMLDivElement>(null);
    const ref = (forwardedRef as React.RefObject<HTMLDivElement>) || internalRef;

    const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el) return;

      const { scrollTop, scrollHeight, clientHeight } = el;
      const atTop = scrollTop <= threshold;
      const atBottom = scrollTop + clientHeight >= scrollHeight - threshold;

      // Stop propagation if we can scroll in the wheel direction
      const scrollingDown = e.deltaY > 0;
      const scrollingUp = e.deltaY < 0;

      if ((scrollingDown && !atBottom) || (scrollingUp && !atTop)) {
        e.stopPropagation();
      }

      // Call any passed onWheel handler
      onWheel?.(e);
    };

    return (
      <div
        ref={ref}
        className={cn("overflow-auto overscroll-contain", className)}
        onWheel={handleWheel}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ScrollContainer.displayName = "ScrollContainer";
