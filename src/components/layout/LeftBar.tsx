"use client";

import {
  Twitter,
  Youtube,
  Twitch,
  MessageCircle,
  Instagram,
  LucideIcon,
  ExternalLink,
  Loader2,
} from "lucide-react";
import { useProfile, getPerson, type Social } from "@/hooks/useCMS";

// Platform to icon mapping
const platformIcons: Record<string, LucideIcon> = {
  twitter: Twitter,
  bluesky: Twitter, // Use Twitter icon for bluesky for now
  youtube: Youtube,
  twitch: Twitch,
  discord: MessageCircle,
  instagram: Instagram,
  tiktok: ExternalLink,
  pixiv: ExternalLink,
  vgen: ExternalLink,
  website: ExternalLink,
  other: ExternalLink,
};

interface SocialLink {
  name: string;
  url: string;
  icon: LucideIcon;
}

export function LeftBar() {
  const { data: profile, loading, error } = useProfile();

  // Get social links from profile.person.socials
  const person = getPerson(profile?.person);
  // Filter out unpopulated social IDs (numbers) and keep only populated Social objects
  const socials: Social[] = (person?.socials || []).filter(
    (s): s is Social => typeof s !== "number",
  );

  const socialLinks: SocialLink[] = socials.map((social) => ({
    name: social.name,
    url: social.url,
    icon: platformIcons[social.platform] || ExternalLink,
  }));

  if (error) {
    console.warn("Failed to fetch profile for social links:", error);
  }

  if (loading) {
    return (
      <div className="fixed left-0 top-1/2 z-50 -translate-y-1/2 flex flex-col  gap-4 ">
        <div className="flex h-12 w-12 items-center justify-center rounded-r-2xl bg-black/40 backdrop-blur-lg">
          <Loader2 className="h-5 w-5 animate-spin text-white/40" />
        </div>
      </div>
    );
  }

  if (socialLinks.length === 0) {
    return null;
  }

  return (
    <div className="fixed left-0 h-full top-1/2 z-50 -translate-y-1/2 flex flex-col  gap-4 justify-center">
      {socialLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group relative flex h-[15%] w-12 items-center justify-center rounded-r-xl bg-black/40 text-white/70 backdrop-blur-lg transition-all duration-300 hover:bg-black/60 hover:text-white"
          aria-label={link.name}
        >
          <div className="rotate-90 flex  flex-row  gap-4 ">
            <h1 className="text-white text-base">{link.name}</h1>
            <link.icon className="h-5 w-5" />
          </div>

          {/* Tooltip */}
          <span className="absolute left-full ml-3 whitespace-nowrap rounded-md bg-black/80 px-2 py-1 text-sm text-white opacity-0 transition-opacity group-hover:opacity-100">
            {link.name}
          </span>
        </a>
      ))}
    </div>
  );
}
