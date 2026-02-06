"use client";

import { cn } from "@/lib/utils";
import {
  motion,
  MotionStyle,
  useTransform,
  type MotionValue,
} from "framer-motion";

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
    const mirrored = 2 * (v < 0.5 ? v : 1 - v);
    return min + mirrored * (max - min) + "%";
  });
  return (
    <motion.div className={cn("h-full", className)} style={{ width }}>
      {children}
    </motion.div>
  );
}

type StyleValue = number | string;
type StyleObject = Record<string, StyleValue>;

function interpolateValue(from: StyleValue, to: StyleValue, t: number): StyleValue {
  if (typeof from === "number" && typeof to === "number") {
    return from + (to - from) * t;
  }
  const fromStr = String(from);
  const toStr = String(to);
  const fromNum = parseFloat(fromStr);
  const toNum = parseFloat(toStr);
  const unit = fromStr.replace(/[-\d.]/g, "") || toStr.replace(/[-\d.]/g, "");
  return `${fromNum + (toNum - fromNum) * t}${unit}`;
}

interface IndexDrivenProps {
  index: MotionValue<number>;
  className?: string;
  children: React.ReactNode;
  from?: StyleObject;
  to?: StyleObject;
  style?: MotionStyle;
}

export function IndexDriven({
  index,
  className,
  children,
  from = {},
  to = {},
  style: staticStyle,
}: Readonly<IndexDrivenProps>) {
  const animatedStyle = useTransform(index, (x) => {
    const v = mapToFlatOnly(x);
    const mirrored = 2 * (v < 0.5 ? v : 1 - v);

    const keys = new Set([...Object.keys(from), ...Object.keys(to)]);
    const result: StyleObject = {};

    for (const key of keys) {
      const fromVal = from[key] ?? to[key];
      const toVal = to[key] ?? from[key];
      result[key] = interpolateValue(fromVal, toVal, mirrored);
    }

    return result;
  });

  return (
    <motion.div
      className={cn(className)}
      style={{ ...staticStyle, ...animatedStyle } as MotionStyle}
    >
      {children}
    </motion.div>
  );
}
