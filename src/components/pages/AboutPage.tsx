"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import {
  Heart,
  ThumbsDown,
  Gamepad,
  Hash,
  Calendar,
  Ruler,
  LucideIcon,
  Star,
  Music,
  Sparkles,
  Coffee,
  Loader2,
} from "lucide-react";
import type { LRProps, PageContent } from "@/components/layout/BookLayout";
import {
  useProfile,
  getModel,
  getMedia,
  nullToUndefined,
} from "@/hooks/useCMS";
import { ModelShowcase } from "@/components/display/ModelShowcase";
import { useMotionValueState } from "@/hooks/useMotionValueState";

// Icon mapping for dynamic traits
const iconMap: Record<string, LucideIcon> = {
  Gamepad,
  Heart,
  ThumbsDown,
  Star,
  Music,
  Sparkles,
  Coffee,
  Hash,
};

function LoadingSkeleton() {
  return (
    <div className="flex h-full items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-(--page-text)/40" />
    </div>
  );
}

function AboutLeft({ index }: Readonly<LRProps>) {
  const currentPage = useMotionValueState(index);
  // Load data when within 1 page of visibility
  const isNearVisible = currentPage > 0;

  const { data: profile, loading } = useProfile({ skip: !isNearVisible });

  if (!isNearVisible || loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center gap-4 p-4">
      <ModelShowcase model={getModel(profile?.currentModel)} />
      <button className="rounded-full bg-(--page-surface)/10 px-4 py-2 text-sm font-medium text-(--page-text) transition-colors hover:bg-(--page-surface)/20">
        View All Models →
      </button>
    </div>
  );
}

function AboutRight({ index }: Readonly<LRProps>) {
  const currentPage = useMotionValueState(index);
  // Load data when within 1 page of visibility
  const isNearVisible = currentPage > 0;

  const { data: profile, loading } = useProfile({ skip: !isNearVisible });

  if (!isNearVisible || loading) {
    return <LoadingSkeleton />;
  }

  if (!profile) {
    return (
      <div className="flex h-full items-center justify-center text-(--page-text)/60">
        Profile not found
      </div>
    );
  }

  // Get the current model from union type
  const currentModel = getModel(profile.currentModel);

  return (
    <div className="h-full space-y-4 overflow-y-auto p-4 scrollbar-thin scrollbar-track-(--page-surface)/5 scrollbar-thumb-(--page-surface)/20">
      <div>
        {currentModel?.refSheets?.map((v, i) => {
          const media = getMedia(v.media);
          if (!media?.url) return null;
          return (
            <Image
              key={media.id ?? i}
              alt={media.alt ?? v.label ?? ""}
              src={media.url}
              width={200}
              height={200}
            />
          );
        })}
      </div>

      {/* Name & Tagline */}
      <div>
        <h1 className="text-3xl font-bold text-(--page-text)">
          {profile.name}
        </h1>
        {profile.alternateName && (
          <p className="text-lg text-(--page-text)/60">
            {profile.alternateName}
          </p>
        )}
        {profile.tagline && (
          <p className="mt-1 text-primary">{profile.tagline}</p>
        )}
      </div>

      {/* Bio */}
      {profile.shortBio && (
        <p className="text-(--page-text)/80">{profile.shortBio}</p>
      )}

      {/* Stats */}
      <div className="flex gap-6">
        {profile.birthday && (
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-(--page-text)/60" />
            <span className="text-sm text-(--page-text)/80">
              {new Date(profile.birthday).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
              })}
            </span>
          </div>
        )}
        {profile.height && (
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-(--page-text)/60" />
            <span className="text-sm text-(--page-text)/80">
              {profile.height}
            </span>
          </div>
        )}
      </div>

      {/* Info sections */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Dynamic traits from CMS */}
        {profile.traits?.map((trait) => {
          const IconComponent = iconMap[trait.icon || "Star"] || Star;
          const items = trait.items?.map((i) => i.value) || [];
          return (
            <InfoSection
              key={trait.category}
              icon={IconComponent}
              title={trait.category}
              items={items}
              customColor={nullToUndefined(trait.color)}
            />
          );
        })}

        {/* Hashtags */}
        {profile.hashtags && profile.hashtags.length > 0 && (
          <div className="rounded-xl bg-(--page-surface)/5 p-4">
            <div className="mb-2 flex items-center gap-2">
              <Hash className="h-4 w-4 text-(--page-primary)" />
              <h3 className="font-medium text-(--page-text)">Hashtags</h3>
            </div>
            <div className="space-y-1 text-sm">
              {profile.hashtags.map((hashtag) => (
                <p key={hashtag.label} className="text-(--page-text)/60">
                  {hashtag.label}:{" "}
                  <span className="text-(--page-primary)">{hashtag.value}</span>
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export const AboutPage: PageContent = {
  Left: AboutLeft,
  Right: AboutRight,
};

interface InfoSectionProps {
  icon: LucideIcon;
  title: string;
  items: string[];
  color?: "blue" | "pink" | "red";
  customColor?: string;
}

const colorMap = {
  blue: "text-blue-400",
  pink: "text-pink-400",
  red: "text-red-400",
};

function InfoSection({
  icon: Icon,
  title,
  items,
  color,
  customColor,
}: Readonly<InfoSectionProps>) {
  const colorClass = color ? colorMap[color] : "";

  return (
    <div className="rounded-xl bg-(--page-surface)/5 p-4">
      <div className="mb-2 flex items-center gap-2">
        <Icon
          className={cn("h-4 w-4", colorClass)}
          style={customColor ? { color: customColor } : undefined}
        />
        <h3 className="font-medium text-(--page-text)">{title}</h3>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-(--page-surface)/10 px-2 py-0.5 text-xs text-(--page-text)/80"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
