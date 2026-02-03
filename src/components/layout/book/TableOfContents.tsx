"use client";

import { CONTENT_SECTIONS } from "@/constants/sections";
import type { LRProps, PageContent } from "./Page";

const sections = CONTENT_SECTIONS;

// Section labels for ToC
const sectionLabels: Record<string, string> = {
  about: "About Me",
  artworks: "Artworks",
  discography: "Discography",
  "vtuber-models": "Models",
};

function ToCLeft() {
  return <div className="h-full w-full" />;
}

function ToCRight({ onNavigate }: Readonly<LRProps>) {
  return (
    <div className="flex h-full flex-col justify-center p-8">
      <h2 className="text-2xl font-bold text-(--page-text) mb-6">Contents</h2>
      <ul className="space-y-2">
        {sections.map((section, i) => (
          <li key={section}>
            <button
              onClick={() => onNavigate(i + 1)}
              className="text-(--page-text)/70 hover:text-(--page-text) transition-colors text-left"
            >
              {sectionLabels[section]}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export const ToCPage: PageContent = {
  Left: ToCLeft,
  Right: ToCRight,
};
