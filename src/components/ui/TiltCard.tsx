"use client";

import { useRef, useCallback, ReactNode } from "react";
import { motion, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  /** Disables tilt and idle animation */
  disabled?: boolean;
  /** Max tilt angle in degrees on hover */
  tiltRange?: number;
  /** Idle float amplitude in pixels */
  idleAmplitude?: number;
  /** Idle cycle duration in seconds */
  idleDuration?: number;
  /** Idle start delay in seconds */
  idleDelay?: number;
  /** Spring stiffness (higher = snappier) */
  stiffness?: number;
  /** Spring damping (higher = less bounce) */
  damping?: number;
}

export function TiltCard({
  children,
  className,
  disabled = false,
  tiltRange = 8,
  idleAmplitude = 8,
  idleDuration = 4,
  idleDelay = 0,
  stiffness = 100,
  damping = 50,
}: TiltCardProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const springConfig = { stiffness, damping };
  const mouseX = useSpring(0, springConfig);
  const mouseY = useSpring(0, springConfig);

  const rotateX = useTransform(mouseY, [-1, 1], [tiltRange, -tiltRange]);
  const rotateY = useTransform(mouseX, [-1, 1], [-tiltRange, tiltRange]);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (disabled) return;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      mouseX.set(((e.clientX - rect.left) / rect.width) * 2 - 1);
      mouseY.set(((e.clientY - rect.top) / rect.height) * 2 - 1);
    },
    [mouseX, mouseY, disabled],
  );

  const handleMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  return (
    <motion.div
      ref={containerRef}
      className={className}
      style={disabled ? undefined : { rotateX, rotateY }}
      animate={{ y: disabled ? 0 : [-idleAmplitude, idleAmplitude, -idleAmplitude], x: disabled ? 0 : [-idleAmplitude, idleAmplitude, -idleAmplitude] }}
      transition={{
        y: disabled
          ? { duration: 0.8, ease: "easeInOut" }
          : { duration: idleDuration, delay: idleDelay, repeat: Infinity, ease: "easeInOut" },
        x: disabled
          ? { duration: 0.8, ease: "easeInOut" }
          : { duration: idleDuration, delay: idleDelay, repeat: Infinity, ease: "easeInOut" },
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </motion.div>
  );
}
