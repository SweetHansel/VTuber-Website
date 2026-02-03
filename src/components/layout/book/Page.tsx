"use client";

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

export interface PageContent {
  Left: React.ComponentType<LRProps>;
  Right: React.ComponentType<LRProps>;
}

interface PageProps {
  index: MotionValue<number>;
  pageIndex: number;
  Page: PageContent;
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
      <Page.Left index={innerPageTransforms} onNavigate={onNavigate} />
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
      <Page.Right index={innerPageTransforms} onNavigate={onNavigate} />
    </motion.div>
  );
}
