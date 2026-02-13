import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { ARTWORK_TYPE_COLORS, type ArtworkType } from "@/constants/artworks";

const SEED_SECRET = process.env.SEED_SECRET || "dev-seed-secret";

// =============================================
// SEED DATA — edit these to change seed content
// =============================================

const TAGS = [
  { name: "Gaming", slug: "gaming", color: "#10b981" },
  { name: "Music", slug: "music", color: "#8b5cf6" },
  { name: "Art", slug: "art", color: "#f59e0b" },
  { name: "Chatting", slug: "chatting", color: "#3b82f6" },
  { name: "Collaboration", slug: "collaboration", color: "#ec4899" },
];

const SOCIALS = [
  {
    name: "Twitter",
    platform: "twitter" as const,
    url: "https://x.com/raelaveire",
  },
  {
    name: "YouTube",
    platform: "youtube" as const,
    url: "https://www.youtube.com/@RaeLaveire",
  },
  {
    name: "Twitch",
    platform: "twitch" as const,
    url: "https://www.twitch.tv/raelaveire",
  },
  {
    name: "Instagram",
    platform: "instagram" as const,
    url: "https://www.instagram.com/raelaveire/",
  },
  {
    name: "VGen",
    platform: "vgen" as const,
    url: "https://vgen.co/raelaveire",
  },
  {
    name: "Spotify",
    platform: "other" as const,
    url: "https://open.spotify.com/artist/3gwGyjupd07jScRGPJ3vqC",
  },
  {
    name: "Streamelements",
    platform: "other" as const,
    url: "streamelements.com/raelaveire/tip",
  },
  {
    name: "Apple Music",
    platform: "other" as const,
    url: "https://music.apple.com/id/artist/rae-laveire/1638420526",
  },
];

const PEOPLE = [
  {
    name: "Artist",
    bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    roles: "Illustrator",
  },
];

const MAIN_PERSON = {
  name: "Rae Laveire",
  bio: "🪻 澪彩｜レイです 🎨 your elfie who draws & sing (˵ •̀ ᴗ - ˵ )✧",
  roles: "VTuber, Streamer, Artist, Singer",
};

const MODELS = [
  {
    name: "First Model",
    version: "1.0",
    modelType: "live2d" as const,
    isActive: true,
    debutDate: "2024-06-01T00:00:00.000Z",
  },
  {
    name: "Customizable Model - Default Outfit",
    version: "1.0",
    modelType: "live2d" as const,
    isActive: false,
    debutDate: "2024-06-01T00:00:00.000Z",
  },
];

const TRACKS = [
  {
    title: "No More What Ifs「raelaveire」cover",
    trackType: "cover" as const,
    releaseDate: "2026-02-03T00:00:00.000Z",
  },
  {
    title: "【歌ってみた】 勝って泣こうゼ! / T-Pistonz+KMC 「Rae x Ollie」",
    trackType: "cover" as const,
    releaseDate: "2025-01-15T00:00:00.000Z",
  },
  {
    title: "Pallet / みかん汁 & PSYQUI -「raelaveire」cover",
    trackType: "cover" as const,
    releaseDate: "2025-01-15T00:00:00.000Z",
  },
  {
    title: "「歌ってみた」マシュマロ / DECO*27 - Rae Laveire",
    trackType: "cover" as const,
    releaseDate: "2025-01-15T00:00:00.000Z",
  },
  {
    title: "Asphyxia / Cö shu Nie - 澪彩 (cover)",
    trackType: "cover" as const,
    releaseDate: "2025-01-15T00:00:00.000Z",
  },
  {
    title: "怪獣の花唄 / Vaundy - cover『raelaveire』",
    trackType: "cover" as const,
    releaseDate: "2025-01-15T00:00:00.000Z",
  },
  {
    title: "Gleaming Ray ~ 閃光 ~ Rae Laveire ft. ゆうゆ",
    trackType: "original" as const,
    releaseDate: "2022-03-22T00:00:00.000Z",
  },
  {
    title: "「Moonlit Nocturne」- Jun Kuroda",
    trackType: "original" as const,
    releaseDate: "2022-06-24T00:00:00.000Z",
  },
  {
    title: "「Curiosity Ray」- Link\"0",
    trackType: "original" as const,
    releaseDate: "2022-03-14T00:00:00.000Z",
  },
];

const PROFILE = {
  name: "Rae Laveire",
  alternateName: "Rae",
  tagline: "Your elfie who draws & sings! (˵ •̀ ᴗ - ˵ )✧",
  shortBio:
    "やっほー！絵を描いて歌うエルフィー、レイ・ラヴィエールと申します✧",
  debutDate: "2026-03-22T00:00:00.000Z",
  birthday: "2026-02-03T00:00:00.000Z",
  height: "150cm",
  traits: [
    {
      category: "Hobbies",
      icon: "Gamepad",
      color: "#3b82f6",
      items: [
        { value: "Lorem" },
        { value: "Ipsum" },
        { value: "Dolor" },
        { value: "Sit" },
      ],
    },
    {
      category: "Likes",
      icon: "Heart",
      color: "#ec4899",
      items: [
        { value: "Amet" },
        { value: "Consectetur" },
        { value: "Adipiscing" },
        { value: "Elit" },
      ],
    },
    {
      category: "Dislikes",
      icon: "ThumbsDown",
      color: "#ef4444",
      items: [
        { value: "Nulla interdum" },
        { value: "Dapibus metus" },
        { value: "At vestibulum" },
      ],
    },
  ],
  hashtags: [
    { label: "General", value: "#raelaveire" },
    { label: "Art", value: "#laveire_art" },
    { label: "Fan Name", value: "Raegulars" },
  ],
};

const THEMES = {
  phoneBg: "#1e3a8a",
  phoneText: "#ffffff",
  phoneSurface: "#ffffff",
  phonePrimary: "#3b82f6",
  pageBg: "#1e3a8a",
  pageText: "#ffffff",
  pageSurface: "#ffffff",
  pagePrimary: "#3b82f6",
  modalBg: "#1e293b",
  modalText: "#ffffff",
  modalSurface: "#ffffff",
  modalPrimary: "#3b82f6",
};

const SITE_SETTINGS = {
  siteName: "Rae Laveire unOfficial Site",
  siteDescription: "unOfficial website for Rae Laveire",
  seo: {
    defaultTitle: "Rae Laveire unOfficial Site",
    titleTemplate: "%s | Rae Laveire",
    keywords: [
      { keyword: "vtuber" },
      { keyword: "virtual" },
      { keyword: "streamer" },
      { keyword: "content creator" },
      { keyword: "art" },
      { keyword: "singer" },
    ],
  },
};

const LIVESTREAM_SETTINGS = {
  enabled: true,
  pollingInterval: 300,
  alertDuration: 10,
  showFriendStreams: true,
  alertPosition: "bottom-right" as const,
};

const POSTS = [
  {
    title: "Birthday Countdown Stream 2026!",
    postType: "stream" as const,
    status: "published" as const,
    eventDate: "2026-01-01T23:00:00.000Z",
    publishedAt: "2025-12-20T12:00:00.000Z",
    location: "Twitch Live",
    externalLinks: [
      { label: "Twitch", url: "https://youtube.com/@loremipsum" },
    ],
    isPinned: true,
  },
  {
    title: 'New Song Cover Release - "No More What Ifs"',
    postType: "release" as const,
    status: "published" as const,
    publishedAt: "2026-02-03T12:00:00.000Z",
    isPinned: true,
  },
  {
    title: "Birthday Stream Coming Soon!",
    postType: "stream" as const,
    status: "published" as const,
    eventDate: "2026-02-03T20:00:00.000Z",
    publishedAt: "2026-02-01T12:00:00.000Z",
    location: "Twitch Live",
    isPinned: false,
  },
  {
    title: "My Journey as a Virtual Content Creator",
    slug: "my-journey-as-virtual-content-creator",
    postType: "blog" as const,
    excerpt:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reflecting on the past year.",
    content: {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              },
            ],
            version: 1,
          },
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
              },
            ],
            version: 1,
          },
        ],
        direction: "ltr" as const,
        format: "",
        indent: 0,
        version: 1,
      },
    },
    status: "published" as const,
    publishedAt: "2026-01-10T12:00:00.000Z",
  },
  {
    title: "Behind the Scenes: Making My First Original Song",
    slug: "behind-the-scenes-first-original-song",
    postType: "blog" as const,
    excerpt: "A look into the creative process behind my debut original song.",
    content: {
      root: {
        type: "root",
        children: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
              },
            ],
            version: 1,
          },
        ],
        direction: "ltr" as const,
        format: "",
        indent: 0,
        version: 1,
      },
    },
    status: "published" as const,
    publishedAt: "2026-01-05T15:00:00.000Z",
  },
];

const INTERACTIVE_MEDIA = [
  {
    name: "Book Cover",
    location: "landing-bottom-right",
    mediaKey: "Book Cover",
  },
  { name: "Background", location: "landing-bg", mediaKey: "Background" },
  { name: "Phone", location: "landing-left", mediaKey: "Phone" },
  {
    name: "Discography Page",
    location: "page-discography",
    mediaKey: "Discography",
  },
  { name: "Artworks Page", location: "page-artworks", mediaKey: "Artwork" },
  {
    name: "Main Character",
    location: "main-character",
    mediaKey: "Character",
    hoverMediaKey: "Character_1",
  },
];

// =============================================
// HELPERS
// =============================================

function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".gif": "image/gif",
    ".webp": "image/webp",
    ".mp3": "audio/mpeg",
    ".wav": "audio/wav",
    ".mp4": "video/mp4",
    ".webm": "video/webm",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, n);
}

function richText(text: string) {
  return {
    root: {
      type: "root" as const,
      children: [
        { type: "paragraph", children: [{ type: "text", text }], version: 1 },
      ],
      direction: "ltr" as const,
      format: "" as const,
      indent: 0,
      version: 1,
    },
  };
}

const MEDIA_EXTENSIONS = [
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".webp",
  ".mp3",
  ".wav",
  ".mp4",
  ".webm",
];

// =============================================
// PROCESSING
// =============================================

type SlotType =
  | "main-character"
  | "landing-left"
  | "landing-bottom-right"
  | "landing-bg"
  | "page-artworks"
  | "page-discography"
  | "page-about"
  | "page-models";

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${SEED_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { getPayload } = await import("payload");
    const config = await import("@payload-config").then((m) => m.default);
    const payload = await getPayload({ config });

    const results: string[] = [];

    // Upload media files from seed/
    const seedDir = path.join(process.cwd(), "seed");
    const files = fs
      .readdirSync(seedDir)
      .filter((f) => MEDIA_EXTENSIONS.includes(path.extname(f).toLowerCase()));

    const mediaMap: Record<string, number> = {};

    for (const filename of files) {
      const filePath = path.join(seedDir, filename);
      const fileBuffer = fs.readFileSync(filePath);
      const baseName = path.basename(filename, path.extname(filename));

      try {
        const media = await payload.create({
          collection: "media",
          data: { alt: baseName.replaceAll(/_/g, " ") },
          file: {
            data: fileBuffer,
            name: filename,
            mimetype: getMimeType(filename),
            size: fileBuffer.length,
          },
        });
        mediaMap[baseName] = media.id;
      } catch (err) {
        console.error(`Failed to upload ${filename}:`, err);
      }
    }
    results.push(`Media uploaded (${Object.keys(mediaMap).length} files)`);

    // Categorize media by name pattern
    const avatarIds = Object.entries(mediaMap)
      .filter(([name]) => name.toLowerCase().startsWith("avatar"))
      .map(([, id]) => id);
    const modelIds = Object.entries(mediaMap)
      .filter(([name]) => name.toLowerCase().startsWith("model"))
      .map(([, id]) => id);
    const coverIds = Object.entries(mediaMap)
      .filter(([name]) => name.toLowerCase().startsWith("cover"))
      .map(([, id]) => id);
    const mp3Ids = Object.entries(mediaMap)
      .filter(([name]) =>
        files.find((f) => f.startsWith(name) && f.endsWith(".mp3")),
      )
      .map(([, id]) => id);

    // Seed tags
    for (const tag of TAGS) {
      try {
        await payload.create({ collection: "tags", data: tag });
      } catch {
        /* skip duplicates */
      }
    }
    results.push(`Tags seeded (${TAGS.length} items)`);

    // Seed socials
    const createdSocialIds: number[] = [];
    for (const social of SOCIALS) {
      try {
        const created = await payload.create({
          collection: "socials",
          data: social,
        });
        createdSocialIds.push(created.id);
      } catch {
        /* skip duplicates */
      }
    }
    results.push(`Socials seeded (${SOCIALS.length} items)`);

    // Seed people
    const createdPeopleIds: number[] = [];
    for (let i = 0; i < PEOPLE.length; i++) {
      try {
        const created = await payload.create({
          collection: "people",
          data: { ...PEOPLE[i], avatar: avatarIds[i % avatarIds.length] },
        });
        createdPeopleIds.push(created.id);
      } catch {
        /* skip duplicates */
      }
    }

    let mainPersonId: number | null = null;
    try {
      const mainPerson = await payload.create({
        collection: "people",
        data: {
          ...MAIN_PERSON,
          avatar: avatarIds[0],
          socials: createdSocialIds,
        },
      });
      mainPersonId = mainPerson.id;
    } catch {
      /* skip if exists */
    }
    results.push(`People seeded (${PEOPLE.length + 1} items)`);

    // Seed models
    const createdModelIds: number[] = [];
    for (let i = 0; i < MODELS.length; i++) {
      const showcaseImages = modelIds.slice(i * 2, i * 2 + 2);
      try {
        const model = await payload.create({
          collection: "models",
          data: {
            ...MODELS[i],
            showcase: showcaseImages.map((mediaId, idx) => ({
              media: mediaId,
              caption: `Lorem ipsum showcase ${idx + 1}`,
              isFeatured: idx === 0,
            })),
            description: richText(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.",
            ),
            credits: randomPickN(createdPeopleIds, 2).map((personId, idx) => ({
              role: idx === 0 ? "Character Design" : "Rigging",
              artist: personId,
            })),
          },
        });
        createdModelIds.push(model.id);
      } catch (err) {
        console.error("Failed to create model:", err);
      }
    }
    results.push(`Models seeded (${createdModelIds.length} items)`);

    // Seed music tracks
    const trackCount = Math.min(mp3Ids.length, coverIds.length, TRACKS.length);
    for (let i = 0; i < trackCount; i++) {
      try {
        await payload.create({
          collection: "music-tracks",
          data: {
            ...TRACKS[i],
            coverArt: coverIds[i],
            audioFile: mp3Ids[i],
            duration: 180 + Math.floor(Math.random() * 120),
            originalArtist:
              TRACKS[i].trackType === "cover" ? "Original Artist" : undefined,
            lyrics: richText(
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit\nSed do eiusmod tempor incididunt ut labore et dolore\nUt enim ad minim veniam, quis nostrud exercitation",
            ),
            credits: [
              { role: "Vocals", artist: mainPersonId },
              { role: "Mix", artist: randomPick(createdPeopleIds) },
              { role: "Illustration", artist: randomPick(createdPeopleIds) },
            ],
            streamingLinks: [
              {
                platform: "youtube" as const,
                url: "https://youtube.com/watch?v=loremipsum",
              },
              {
                platform: "spotify" as const,
                url: "https://open.spotify.com/track/loremipsum",
              },
            ],
          },
        });
      } catch (err) {
        console.error("Failed to create music track:", err);
      }
    }
    results.push(`Music Tracks seeded (${trackCount} items)`);

    // Seed artworks from remaining images
    const artworkImages = Object.entries(mediaMap).filter(
      ([name]) =>
        !files.find(
          (f) =>
            f.startsWith(name) && (f.endsWith(".mp3") || f.endsWith(".wav")),
        ),
    );

    for (const [name, mediaId] of artworkImages) {
      try {
        await payload.create({
          collection: "artworks",
          data: {
            title: name.replaceAll(/_/g, " "),
            image: mediaId,
            artworkType: randomPick(
              Object.keys(ARTWORK_TYPE_COLORS) as ArtworkType[],
            ),
            credits: [{ role: "Artist", person: randomPick(createdPeopleIds) }],
            sourceUrl: "https://twitter.com/artist/status/123456789",
            isFeatured: Math.random() > 0.5,
          },
        });
      } catch (err) {
        console.error("Failed to create artwork:", err);
      }
    }
    results.push(`Artworks seeded (${artworkImages.length} items)`);

    // Seed interactive media
    const createdInteractiveMedia: Array<{
      slot: SlotType;
      configuration: number;
    }> = [];

    for (const config of INTERACTIVE_MEDIA) {
      const defaultMediaId = mediaMap[config.mediaKey];
      if (!defaultMediaId) {
        console.error(`Media not found for ${config.mediaKey}`);
        continue;
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
          name: config.name,
          location: config.location,
          defaultState: { media: defaultMediaId, alt: config.name },
        };

        if (config.hoverMediaKey && mediaMap[config.hoverMediaKey]) {
          data.hoverState = {
            enabled: true,
            media: mediaMap[config.hoverMediaKey],
            alt: `${config.name} hover`,
          };
        }

        const created = await payload.create({
          collection: "interactive-media",
          data,
        });
        createdInteractiveMedia.push({
          slot: config.location as SlotType,
          configuration: created.id,
        });
      } catch (err) {
        console.error(
          `Failed to create interactive media ${config.name}:`,
          err,
        );
      }
    }
    results.push(
      `Interactive Media seeded (${createdInteractiveMedia.length} items)`,
    );

    // Seed globals
    await payload.updateGlobal({
      slug: "profile",
      data: {
        ...PROFILE,
        person: mainPersonId,
        currentModel: createdModelIds[0],
      },
    });
    results.push("Profile seeded");

    await payload.updateGlobal({
      slug: "themes",
      data: { ...THEMES, interactiveMedia: createdInteractiveMedia },
    });
    results.push("Themes seeded");

    await payload.updateGlobal({ slug: "site-settings", data: SITE_SETTINGS });
    results.push("Site Settings seeded");

    const { docs: allSocials } = await payload.find({
      collection: "socials",
      where: {
        or: [
          { platform: { equals: "youtube" } },
          { platform: { equals: "twitch" } },
        ],
      },
    });
    await payload.updateGlobal({
      slug: "livestream-settings",
      data: {
        ...LIVESTREAM_SETTINGS,
        trackedSocials: allSocials.map((s) => s.id),
      },
    });
    results.push("Livestream Settings seeded");

    // Seed posts
    for (const post of POSTS) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await payload.create({ collection: "posts", data: post as any });
      } catch {
        /* skip duplicates */
      }
    }
    results.push(`Posts seeded (${POSTS.length} items)`);

    return NextResponse.json({
      success: true,
      results,
      mediaUploaded: Object.keys(mediaMap).length,
      message: "All data seeded successfully with media!",
    });
  } catch (error) {
    console.error("Seed error:", error);
    return NextResponse.json(
      { error: "Failed to seed data", details: String(error) },
      { status: 500 },
    );
  }
}

export async function GET() {
  return NextResponse.json({
    info: "POST to this endpoint with Authorization: Bearer <SEED_SECRET> to seed all data",
    env: "Set SEED_SECRET environment variable to protect this endpoint",
  });
}
