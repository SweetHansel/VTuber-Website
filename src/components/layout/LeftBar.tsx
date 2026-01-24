"use client";

import {
  useNavigationStore,
  sections,
  type Section,
} from "@/stores/navigationStore";
import { cn } from "@/lib/utils";
import { User, Image, Music, Box, Home, LucideIcon } from "lucide-react";

// Filter out 'toc' for navigation display - only show content sections
const navSections = sections.filter((s) => s !== "toc");

const sectionIcons: Record<Section, LucideIcon> = {
  toc: Home,
  about: User,
  artworks: Image,
  discography: Music,
  "vtuber-models": Box,
};

const sectionLabels: Record<Section, string> = {
  toc: "Home",
  about: "About",
  artworks: "Artworks",
  discography: "Discography",
  "vtuber-models": "Models",
};

export function LeftBar() {
  const { currentSection, setSection } = useNavigationStore();

  return (
    <div className="fixed left-0 top-1/2 z-50 -translate-y-1/2 flex flex-col gap-2 rounded-r-2xl bg-black/40 p-3 backdrop-blur-lg">
      {navSections.map((section) => {
        const Icon = sectionIcons[section];
        const isActive = currentSection === section;

        return (
          <button
            key={section}
            onClick={() => setSection(section)}
            className={cn(
              "group relative flex h-12 w-12 items-center justify-center rounded-xl transition-all duration-300",
              isActive
                ? "bg-white/20 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white",
            )}
            aria-label={sectionLabels[section]}
          >
            <Icon className="h-5 w-5" />

            {/* Tooltip */}
            <span className="absolute left-full ml-3 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
              {sectionLabels[section]}
            </span>
          </button>
        );
      })}
    </div>
  );
}
