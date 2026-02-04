"use client";

import { cn } from "@/lib/utils";
import { motion, useTransform, type MotionValue } from "framer-motion";

// Utility
const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(value, max));

export function mapToFlatOnly(v: number) {
  return (clamp(v, 0.25, 0.75) - 0.25) * 2;
}

export interface LRProps {
  index: MotionValue<number>;
  onNavigate: (page: number) => void;
}

interface PageProps {
  index: MotionValue<number>;
  pageIndex: number;
  Page: React.ComponentType<LRProps>;
  onNavigate: (page: number) => void;
}

export function LeftPage({
  index,
  pageIndex,
  Page,
  onNavigate,
}: Readonly<PageProps>) {
  const rotateY = useTransform(
    index,
    (v) => 180 - (clamp(v - pageIndex, 0.25, 0.75) - 0.25) * 2 * 180,
  );
  const innerPageTransforms = useTransform(
    index,
    (v) => clamp(v - pageIndex - 1, -0.5, 0.5) + 0.5,
  );

  return (
    <motion.div
      className="absolute bg-(--page-bg) w-[50%] h-full top-0 origin-bottom-right backface-hidden transform-flat"
      style={{ rotateY }}
      transition={{ duration: 0.3, bounce: 0 }}
    >
      <Page index={innerPageTransforms} onNavigate={onNavigate} />
    </motion.div>
  );
}

export function RightPage({
  index,
  pageIndex,
  Page,
  onNavigate,
}: Readonly<PageProps>) {
  const rotateY = useTransform(
    index,
    (v) => (clamp(v - pageIndex - 1, 0.25, 0.75) - 0.25) * 2 * -180,
  );
  const innerPageTransforms = useTransform(
    index,
    (v) => clamp(v - pageIndex - 1, -0.5, 0.5) + 0.5,
  );

  return (
    <motion.div
      className="absolute bg-(--page-bg) w-[50%] h-full top-0 origin-bottom-left backface-hidden transform-flat"
      style={{ rotateY, translateX: "100%" }}
      transition={{ duration: 0.3, bounce: 0 }}
    >
      <Page index={innerPageTransforms} onNavigate={onNavigate} />
    </motion.div>
  );
}

export function ExpandingPage({
  index,
  className,
  min,
  max,
  children,
}: Readonly<{
  index: MotionValue<number>;
  className: string;
  min: number;
  max: number;
  children: React.ReactNode;
}>) {
  const width = useTransform(index, (x) => {
    const v = mapToFlatOnly(x);
    const mirrored = v < 0.5 ? v : 1 - v;
    return min + mirrored * 2 * (max - min) + "%";
  });
  return (
    <motion.div className={cn("h-full", className)} style={{ width }}>
      {children}
    </motion.div>
  );
}
