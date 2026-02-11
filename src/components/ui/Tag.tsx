"use client";

import { cn } from "@/lib/utils";
import type { Tag as CMSTag } from "@/payload-types";

interface TagProps {
  tag: CMSTag;
  variant?: "opaque" | "transparent" | "outline";
  size?: "sm" | "md";
  onClick?: () => void;
  className?: string;
}

export function Tag({
  tag,
  variant = "opaque",
  onClick,
  className,
}: TagProps) {
  const isClickable = !!onClick;
  const { name, color } = tag;

  const baseStyles = cn(
    "inline-flex items-center rounded-full font-medium transition-colors",
    "px-3 py-1 text-base",
    isClickable && "cursor-pointer",
  );

  const Component = isClickable ? "button" : "span";

  const style = color
    ? {
        backgroundColor:
          variant === "opaque"
            ? `${color}`
            : variant === "transparent"
              ? `${color}20`
              : "transparent",
        borderColor: variant === "outline" ? color : undefined,
        color: color,
      }
    : undefined;

  const fallbackStyles = !color
    ? variant === "opaque"
      ? "bg-(--modal-surface) text-(--modal-text)"
      : "border border-(--modal-text)/20 text-(--modal-text)/70"
    : variant === "outline"
      ? "border"
      : "";

  return (
    <Component
      onClick={onClick}
      className={cn(baseStyles, fallbackStyles, className)}
      style={style}
    >
      {name}
    </Component>
  );
}

interface BadgeProps {
  label: string;
  colorClass?: string;
  icon?: React.ReactNode;
  size?: "sm" | "md";
  className?: string;
}

export function Badge({
  label,
  colorClass = "bg-gray-500/20 text-gray-300",
  icon,
  className,
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-4 rounded-full font-medium capitalize",
        "px-3 py-1 text-base",
        colorClass,
        className,
      )}
    >
      {icon}
      {label}
    </span>
  );
}

interface TagsProps {
  tags: CMSTag[];
  variant?: "opaque" | "transparent" | "outline";
  size?: "sm" | "md";
  className?: string;
}

export function Tags({ tags, variant, size, className }: TagsProps) {
  if (tags.length === 0) return null;

  return (
    <div className={cn("flex flex-wrap  gap-4", className)}>
      {tags.map((tag) => (
        <Tag key={tag.id} tag={tag} variant={variant} size={size} />
      ))}
    </div>
  );
}
