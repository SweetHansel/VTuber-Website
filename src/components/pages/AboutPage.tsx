"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type { LRProps } from "@/components/layout/BookLayout";
import {
  useProfile,
  getModel,
  getMedia,
  nullToUndefined,
} from "@/hooks/useCMS";
import { ModelShowcase } from "@/components/display/ModelShowcase";
import { useMotionValueState } from "@/hooks/useMotionValueState";
import { ScrollContainer } from "../layout";

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

function AboutLeft({ index, onNavigate }: Readonly<LRProps>) {
  const currentPage = useMotionValueState(index);
  // Load data when visible
  const isVisible = currentPage > 0 && currentPage < 1;

  const { data: profile, loading } = useProfile({ skip: !isVisible });

  // Only show loading on first load (no cached data yet)
  if (!profile && loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="flex h-full flex-col items-center justify-center  gap-4  p-4 ">
      <ModelShowcase model={getModel(profile?.currentModel)} />
      <button
        onClick={() => {
          onNavigate(4);
        }}
        className="rounded-full bg-(--page-surface)/10 px-4 py-2 text-xl font-medium text-(--page-text) transition-colors hover:bg-(--page-surface)/20"
      >
        View All Models →
      </button>
    </div>
  );
}

function AboutRight({ index }: Readonly<LRProps>) {
  const currentPage = useMotionValueState(index);
  // Load data when visible
  const isVisible = currentPage > 0 && currentPage < 1;

  const { data: profile, loading } = useProfile({ skip: !isVisible });

  // Only show loading on first load (no cached data yet)
  if (!profile && loading) {
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
    <ScrollContainer className="h-full flex flex-col p-4 scrollbar-track-(--page-surface)/5 scrollbar-thumb-(--page-surface)/20 items-center">
      <div className="flex flex-col w-full max-w-2xl gap-4 my-auto">
        <RefSheetCarousel refSheets={currentModel?.refSheets} />

        <div className="flex flex-col w-full max-w-lg gap-4 mx-auto">
        {/* Name & Tagline */}
        <div>
          <h1 className="text-4xl font-bold text-(--page-text)">
            {profile.name}
          </h1>
          {profile.alternateName && (
            <p className="text-2xl text-(--page-text)/60">
              {profile.alternateName}
            </p>
          )}
          {profile.tagline && (
            <p className="mt-1 text-lg text-primary">{profile.tagline}</p>
          )}
        </div>

        {/* Bio */}
        {profile.shortBio && (
          <p className=" text-lg text-(--page-text)/80">{profile.shortBio}</p>
        )}

        {/* Stats */}
        <div className="flex  gap-4 ">
          {profile.birthday && (
            <div className="flex items-center  gap-4 ">
              <Calendar className="h-4 w-4 text-(--page-text)/60" />
              <span className="text-lg text-(--page-text)/80">
                {new Date(profile.birthday).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          )}
          {profile.height && (
            <div className="flex items-center  gap-4 ">
              <Ruler className="h-4 w-4 text-(--page-text)/60" />
              <span className="text-lg text-(--page-text)/80">
                {profile.height}
              </span>
            </div>
          )}
        </div>

        {/* Info sections */}
        <div className="grid  gap-4 md:grid-cols-2">
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
            <div className="rounded-xl bg-(--page-surface)/5 p-4 ">
              <div className="mb-2 flex items-center  gap-4 ">
                <Hash className="h-4 w-4 text-(--page-primary)" />
                <h3 className="font-medium text-lg text-(--page-text)">
                  Hashtags
                </h3>
              </div>
              <div className="space-y-1 text-base">
                {profile.hashtags.map((hashtag) => (
                  <p key={hashtag.label} className="text-(--page-text)/60">
                    {hashtag.label}:{" "}
                    <span className="text-base text-(--page-primary)">
                      {hashtag.value}
                    </span>
                  </p>
                ))}
              </div>
            </div>
          )}
        </div>


        </div>
      </div>
    </ScrollContainer>
  );
}

export const AboutPage = [AboutLeft, AboutRight];

interface RefSheetCarouselProps {
  refSheets?:
    | {
        media: number | import("@/payload-types").Media;
        label?: string | null;
        id?: string | null;
      }[]
    | null;
}

function RefSheetCarousel({ refSheets }: Readonly<RefSheetCarouselProps>) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const validSheets = (refSheets ?? [])
    .map((v, i) => ({ ...v, mediaObj: getMedia(v.media), originalIndex: i }))
    .filter((v) => v.mediaObj?.url);

  if (validSheets.length === 0) return null;

  const hasMultiple = validSheets.length > 1;
  const current = validSheets[currentIndex % validSheets.length];
  const media = current.mediaObj!;

  const goNext = () =>
    setCurrentIndex((prev) => (prev + 1) % validSheets.length);
  const goPrev = () =>
    setCurrentIndex(
      (prev) => (prev - 1 + validSheets.length) % validSheets.length,
    );

  return (
    <div className="relative w-full aspect-video rounded-xl bg-(--page-surface)/5 overflow-visible">
      {/* Image container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="flex justify-center w-full h-full"
        >
          <Image
            src={media.url!}
            alt={media.alt ?? current.label ?? "Reference sheet"}
            fill
            className="object-contain"
          />
        </motion.div>
      </AnimatePresence>

      {/* Nav arrows */}
      {hasMultiple && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-(--page-surface)/5 text-(--page-text)/80 backdrop-blur-sm transition-colors hover:bg-(--page-surface)/10 hover:text-(--page-text)"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center rounded-full bg-(--page-surface)/5 text-(--page-text)/80 backdrop-blur-sm transition-colors hover:bg-(--page-surface)/10 hover:text-(--page-text)"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Label */}
      {current.label && (
        <p className="py-2 text-center text-sm text-(--page-text)/60">
          {current.label}
        </p>
      )}

      {/* Dot indicators */}
      {hasMultiple && (
        <div className="flex justify-center gap-2 pb-3">
          {validSheets.map((_, index) => (
            <button
              key={"refsheet_dot_" + index}
              onClick={() => setCurrentIndex(index)}
              className={cn(
                "h-2 w-2 rounded-full transition-all",
                index === currentIndex % validSheets.length
                  ? "bg-(--page-surface) w-4"
                  : "bg-(--page-surface)/40 hover:bg-(--page-surface)/60",
              )}
            />
          ))}
        </div>
      )}
    </div>
  );
}

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
    <div className="rounded-xl bg-(--page-surface)/5 p-4 ">
      <div className="mb-2 flex items-center  gap-4 ">
        <Icon
          className={cn("h-4 w-4", colorClass)}
          style={customColor ? { color: customColor } : undefined}
        />
        <h3 className="font-medium text-lg text-(--page-text)">{title}</h3>
      </div>
      <div className="flex flex-wrap  gap-4 ">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-(--page-surface)/10 px-2 py-0.5 text-base text-(--page-text)/80"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
