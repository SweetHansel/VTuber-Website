import { NextResponse } from 'next/server'
import fs from 'node:fs'
import path from 'node:path'
import { ARTWORK_TYPE_COLORS, type ArtworkType } from '@/constants/artworks'

// Protect with a secret - set SEED_SECRET env var in Vercel
const SEED_SECRET = process.env.SEED_SECRET || 'dev-seed-secret'

// Helper to get mime type from extension
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase()
  const mimeTypes: Record<string, string> = {
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
  }
  return mimeTypes[ext] || 'application/octet-stream'
}

// Helper to pick random item from array
function randomPick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)]
}

// Helper to pick N random items from array
function randomPickN<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, n)
}

export async function POST(request: Request) {
  try {
    // Check authorization
    const authHeader = request.headers.get('authorization')
    if (authHeader !== `Bearer ${SEED_SECRET}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    const results: string[] = []

    // ============================================
    // STEP 1: Upload all media files from public/
    // ============================================
    const publicDir = path.join(process.cwd(), 'seed')
    const files = fs.readdirSync(publicDir).filter(f => {
      const ext = path.extname(f).toLowerCase()
      return ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.mp3', '.wav', '.mp4', '.webm'].includes(ext)
    })

    const mediaMap: Record<string, number> = {} // filename (without ext) -> media ID

    for (const filename of files) {
      const filePath = path.join(publicDir, filename)
      const fileBuffer = fs.readFileSync(filePath)
      const baseName = path.basename(filename, path.extname(filename))

      try {
        const media = await payload.create({
          collection: 'media',
          data: {
            alt: baseName.replaceAll(/_/g, ' '),
          },
          file: {
            data: fileBuffer,
            name: filename,
            mimetype: getMimeType(filename),
            size: fileBuffer.length,
          },
        })
        mediaMap[baseName] = media.id
      } catch (err) {
        console.error(`Failed to upload ${filename}:`, err)
      }
    }
    results.push(`Media uploaded (${Object.keys(mediaMap).length} files)`)

    // Categorize media by name pattern
    const avatarIds = Object.entries(mediaMap)
      .filter(([name]) => name.toLowerCase().startsWith('avatar'))
      .map(([, id]) => id)

    const modelIds = Object.entries(mediaMap)
      .filter(([name]) => name.toLowerCase().startsWith('model'))
      .map(([, id]) => id)

    const coverIds = Object.entries(mediaMap)
      .filter(([name]) => name.toLowerCase().startsWith('cover'))
      .map(([, id]) => id)

    const mp3Ids = Object.entries(mediaMap)
      .filter(([name]) => {
        const filename = files.find(f => f.startsWith(name) && f.endsWith('.mp3'))
        return !!filename
      })
      .map(([, id]) => id)

    // ============================================
    // STEP 2: Seed Tags
    // ============================================
    const tags = [
      { name: 'Gaming', slug: 'gaming', color: '#10b981' },
      { name: 'Music', slug: 'music', color: '#8b5cf6' },
      { name: 'Art', slug: 'art', color: '#f59e0b' },
      { name: 'Chatting', slug: 'chatting', color: '#3b82f6' },
      { name: 'Collaboration', slug: 'collaboration', color: '#ec4899' },
      { name: 'Karaoke', slug: 'karaoke', color: '#ef4444' },
      { name: 'ASMR', slug: 'asmr', color: '#06b6d4' },
      { name: 'Cooking', slug: 'cooking', color: '#f97316' },
    ]

    for (const tag of tags) {
      try {
        await payload.create({ collection: 'tags', data: tag })
      } catch {
        // Skip duplicates
      }
    }
    results.push(`Tags seeded (${tags.length} items)`)

    // ============================================
    // STEP 3: Seed Socials
    // ============================================
    const socials = [
      { name: 'Twitter', platform: 'twitter' as const, url: 'https://twitter.com/loremipsum' },
      { name: 'YouTube', platform: 'youtube' as const, url: 'https://youtube.com/@loremipsum' },
      { name: 'Twitch', platform: 'twitch' as const, url: 'https://twitch.tv/loremipsum' },
      { name: 'Instagram', platform: 'instagram' as const, url: 'https://instagram.com/loremipsum' },
    ]

    const createdSocialIds: number[] = []
    for (const social of socials) {
      try {
        const created = await payload.create({ collection: 'socials', data: social })
        createdSocialIds.push(created.id)
      } catch {
        // Skip duplicates
      }
    }
    results.push(`Socials seeded (${socials.length} items)`)

    // ============================================
    // STEP 4: Seed People (with avatars)
    // ============================================
    const peopleData = [
      { name: 'Artist', bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.', roles: 'Illustrator' },
      { name: 'Music Producer', bio: 'Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.', roles: 'Music Producer, Composer' },
      { name: 'Rigger', bio: 'Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.', roles: 'Live2D Rigger' },
      { name: 'Video Editor', bio: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum.', roles: 'Video Editor, Animator' },
      { name: 'Mixer Engineer', bio: 'Excepteur sint occaecat cupidatat non proident, sunt in culpa.', roles: 'Mix Engineer, Master Engineer' },
    ]

    const createdPeopleIds: number[] = []
    for (let i = 0; i < peopleData.length; i++) {
      const person = peopleData[i]
      try {
        const created = await payload.create({
          collection: 'people',
          data: {
            ...person,
            avatar: avatarIds[i % avatarIds.length], // Assign avatars cyclically
          },
        })
        createdPeopleIds.push(created.id)
      } catch {
        // Skip duplicates
      }
    }

    // Create main VTuber person
    let mainPersonId: number | null = null
    try {
      const mainPerson = await payload.create({
        collection: 'people',
        data: {
          name: 'Lorem Ipsum',
          bio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi.',
          roles: 'VTuber, Streamer, Singer',
          avatar: avatarIds[0],
          socials: createdSocialIds,
        },
      })
      mainPersonId = mainPerson.id
    } catch {
      // Skip if exists
    }
    results.push(`People seeded (${peopleData.length + 1} items with avatars)`)

    // ============================================
    // STEP 5: Seed Models (with showcase images)
    // ============================================
    const modelNames = ['Default Model', 'Summer Outfit']
    const createdModelIds: number[] = []

    for (let i = 0; i < 2; i++) {
      const showcaseImages = modelIds.slice(i * 2, i * 2 + 2)
      try {
        const model = await payload.create({
          collection: 'models',
          data: {
            name: modelNames[i],
            version: `${i + 1}.0`,
            modelType: 'live2d',
            showcase: showcaseImages.map((mediaId, idx) => ({
              media: mediaId,
              caption: `Lorem ipsum showcase ${idx + 1}`,
              isFeatured: idx === 0,
            })),
            description: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.' }],
                    version: 1,
                  },
                ],
                direction: 'ltr' as const,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            credits: randomPickN(createdPeopleIds, 2).map((personId, idx) => ({
              role: idx === 0 ? 'Character Design' : 'Rigging',
              artist: personId,
            })),
            isActive: i === 0,
            debutDate: '2024-06-01T00:00:00.000Z',
          },
        })
        createdModelIds.push(model.id)
      } catch (err) {
        console.error('Failed to create model:', err)
      }
    }
    results.push(`Models seeded (${createdModelIds.length} items with showcase)`)

    // ============================================
    // STEP 6: Seed Music Tracks (with covers and credits)
    // ============================================
    const trackTypes = ['cover', 'original', 'cover', 'original', 'remix', 'cover'] as const
    const trackNames = [
      'Placeholder Dreams',
      'Lorem Ipsum Song',
      'Dolor Sit Amet',
      'Consectetur Melody',
      'Adipiscing Remix',
      'Tempor Incididunt',
    ]

    for (let i = 0; i < Math.min(mp3Ids.length, coverIds.length); i++) {
      try {
        await payload.create({
          collection: 'music-tracks',
          data: {
            title: trackNames[i] || `Track ${i + 1}`,
            trackType: trackTypes[i % trackTypes.length],
            coverArt: coverIds[i],
            audioFile: mp3Ids[i],
            duration: 180 + Math.floor(Math.random() * 120),
            originalArtist: trackTypes[i % trackTypes.length] === 'cover' ? 'Original Artist' : undefined,
            lyrics: {
              root: {
                type: 'root',
                children: [
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit' }],
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: 'Sed do eiusmod tempor incididunt ut labore et dolore' }],
                    version: 1,
                  },
                  {
                    type: 'paragraph',
                    children: [{ type: 'text', text: 'Ut enim ad minim veniam, quis nostrud exercitation' }],
                    version: 1,
                  },
                ],
                direction: 'ltr' as const,
                format: '',
                indent: 0,
                version: 1,
              },
            },
            credits: [
              { role: 'Vocals', artist: mainPersonId },
              { role: 'Mix', artist: randomPick(createdPeopleIds) },
              { role: 'Illustration', artist: randomPick(createdPeopleIds) },
            ],
            streamingLinks: [
              { platform: 'youtube' as const, url: 'https://youtube.com/watch?v=loremipsum' },
              { platform: 'spotify' as const, url: 'https://open.spotify.com/track/loremipsum' },
            ],
            releaseDate: `2025-0${i + 1}-15T00:00:00.000Z`,
          },
        })
      } catch (err) {
        console.error('Failed to create music track:', err)
      }
    }
    results.push(`Music Tracks seeded (${Math.min(mp3Ids.length, coverIds.length)} items)`)

    // ============================================
    // STEP 7: Create Artworks for remaining images
    // ============================================
    const excludedPrefixes = ["ZZ"]
    const artworkImages = Object.entries(mediaMap).filter(([name]) => {
      const lowerName = name.toLowerCase()
      return !excludedPrefixes.some(prefix => lowerName.startsWith(prefix)) &&
        !files.find(f => f.startsWith(name) && (f.endsWith('.mp3') || f.endsWith('.wav')))
    })

    for (const [name, mediaId] of artworkImages) {
      try {
        await payload.create({
          collection: 'artworks',
          data: {
            title: name.replaceAll(/_/g, ' '),
            image: mediaId,
            artworkType: randomPick(Object.keys(ARTWORK_TYPE_COLORS) as ArtworkType[]),
            credits: [
              { role: 'Artist', person: randomPick(createdPeopleIds) },
            ],
            sourceUrl: 'https://twitter.com/artist/status/123456789',
            isFeatured: Math.random() > 0.5,
          },
        })
      } catch (err) {
        console.error('Failed to create artwork:', err)
      }
    }
    results.push(`Artworks seeded (${artworkImages.length} items)`)

    // ============================================
    // STEP 8: Create Interactive Media
    // ============================================
    const interactiveMediaConfigs = [
      {
        name: 'Book Cover',
        location: 'landing-bottom-right',
        mediaKey: 'Book Cover',
      },
      {
        name: 'Background',
        location: 'landing-bg',
        mediaKey: 'Background',
      },
      {
        name: 'Phone',
        location: 'landing-left',
        mediaKey: 'Phone',
      },
      {
        name: 'Discography Page',
        location: 'page-discography',
        mediaKey: 'Discography',
      },
      {
        name: 'Artworks Page',
        location: 'page-artworks',
        mediaKey: 'Artwork',
      },
      {
        name: 'Main Character',
        location: 'main-character',
        mediaKey: 'Character',
        hoverMediaKey: 'Character_1',
      },
    ]

    type SlotType = 'main-character' | 'landing-left' | 'landing-bottom-right' | 'landing-bg' | 'page-artworks' | 'page-discography' | 'page-about' | 'page-models'
    const createdInteractiveMedia: Array<{ slot: SlotType; configuration: number }> = []

    for (const config of interactiveMediaConfigs) {
      const defaultMediaId = mediaMap[config.mediaKey]
      if (!defaultMediaId) {
        console.error(`Media not found for ${config.mediaKey}`)
        continue
      }

      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const data: any = {
          name: config.name,
          location: config.location,
          defaultState: {
            media: defaultMediaId,
            alt: config.name,
          },
        }

        // Add hover state if specified
        if (config.hoverMediaKey && mediaMap[config.hoverMediaKey]) {
          data.hoverState = {
            enabled: true,
            media: mediaMap[config.hoverMediaKey],
            alt: `${config.name} hover`,
          }
        }

        const created = await payload.create({
          collection: 'interactive-media',
          data,
        })

        createdInteractiveMedia.push({
          slot: config.location as SlotType,
          configuration: created.id,
        })
      } catch (err) {
        console.error(`Failed to create interactive media ${config.name}:`, err)
      }
    }
    results.push(`Interactive Media seeded (${createdInteractiveMedia.length} items)`)

    // ============================================
    // STEP 9: Seed Profile global (with model)
    // ============================================
    await payload.updateGlobal({
      slug: 'profile',
      data: {
        name: 'Lorem Ipsum',
        alternateName: 'ロレム・イプサム',
        tagline: 'Lorem ipsum dolor sit amet.',
        shortBio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla interdum dapibus metus, at vestibulum magna venenatis sit amet. Suspendisse potenti. Aliquam quis tempor velit.',
        debutDate: '2024-06-01T00:00:00.000Z',
        birthday: '2025-03-15T00:00:00.000Z',
        height: '160cm',
        traits: [
          {
            category: 'Hobbies',
            icon: 'Gamepad',
            color: '#3b82f6',
            items: [{ value: 'Lorem' }, { value: 'Ipsum' }, { value: 'Dolor' }, { value: 'Sit' }],
          },
          {
            category: 'Likes',
            icon: 'Heart',
            color: '#ec4899',
            items: [{ value: 'Amet' }, { value: 'Consectetur' }, { value: 'Adipiscing' }, { value: 'Elit' }],
          },
          {
            category: 'Dislikes',
            icon: 'ThumbsDown',
            color: '#ef4444',
            items: [{ value: 'Nulla interdum' }, { value: 'Dapibus metus' }, { value: 'At vestibulum' }],
          },
        ],
        hashtags: [
          { label: 'General', value: '#LoremIpsum' },
          { label: 'Fan Art', value: '#LoremIpsumArt' },
          { label: 'Stream', value: '#LoremIpsumLive' },
          { label: 'Fan Name', value: 'PlaceHolders' },
        ],
        person: mainPersonId,
        currentModel: createdModelIds[0],
      },
    })
    results.push('Profile seeded (with model)')

    // ============================================
    // STEP 10: Seed Themes global (with interactive media)
    // ============================================
    await payload.updateGlobal({
      slug: 'themes',
      data: {
        phoneBg: '#1e3a8a',
        phoneText: '#ffffff',
        phoneSurface: '#ffffff',
        phonePrimary: '#3b82f6',
        pageBg: '#1e3a8a',
        pageText: '#ffffff',
        pageSurface: '#ffffff',
        pagePrimary: '#3b82f6',
        modalBg: '#1e293b',
        modalText: '#ffffff',
        modalSurface: '#ffffff',
        modalPrimary: '#3b82f6',
        interactiveMedia: createdInteractiveMedia,
      },
    })
    results.push('Themes seeded (with interactive media)')

    // ============================================
    // STEP 11: Seed Site Settings
    // ============================================
    await payload.updateGlobal({
      slug: 'site-settings',
      data: {
        siteName: 'Lorem Ipsum Official Site',
        siteDescription: 'Official website for Lorem Ipsum - Virtual Content Creator',
        seo: {
          defaultTitle: 'Lorem Ipsum - Virtual Content Creator',
          titleTemplate: '%s | Lorem Ipsum',
          keywords: [
            { keyword: 'vtuber' },
            { keyword: 'virtual' },
            { keyword: 'streamer' },
            { keyword: 'content creator' },
          ],
        },
      },
    })
    results.push('Site Settings seeded')

    // ============================================
    // STEP 12: Seed Posts (combined announcements + blog posts)
    // ============================================
    const posts = [
      // Stream/Event type posts (former announcements)
      { title: 'New Year Countdown Stream 2026!', postType: 'stream' as const, status: 'published' as const, eventDate: '2026-01-01T23:00:00.000Z', publishedAt: '2025-12-20T12:00:00.000Z', location: 'YouTube Live', externalLinks: [{ label: 'YouTube', url: 'https://youtube.com/@loremipsum' }], isPinned: true },
      { title: 'New Original Song Release - "Placeholder Dreams"', postType: 'release' as const, status: 'published' as const, publishedAt: '2026-01-08T12:00:00.000Z', isPinned: true },
      { title: 'Collaboration Stream with Friends', postType: 'collab' as const, status: 'published' as const, eventDate: '2026-01-20T20:00:00.000Z', publishedAt: '2026-01-15T12:00:00.000Z', location: 'Twitch', isPinned: false },
      { title: 'Milestone Celebration: 100k Subscribers!', postType: 'event' as const, status: 'published' as const, eventDate: '2026-02-01T19:00:00.000Z', publishedAt: '2026-01-25T12:00:00.000Z', location: 'YouTube Live', isPinned: false },
      { title: 'Weekly Gaming Stream Schedule Update', postType: 'general' as const, status: 'published' as const, publishedAt: '2026-01-12T12:00:00.000Z', isPinned: false },
      { title: 'Fan Art Contest Announcement', postType: 'event' as const, status: 'published' as const, eventDate: '2026-02-14T00:00:00.000Z', publishedAt: '2026-02-01T12:00:00.000Z', externalLinks: [{ label: 'Twitter', url: 'https://twitter.com/loremipsum' }], isPinned: false },
      { title: 'Birthday Stream Coming Soon!', postType: 'stream' as const, status: 'published' as const, eventDate: '2026-03-15T20:00:00.000Z', publishedAt: '2026-03-01T12:00:00.000Z', location: 'YouTube Live', isPinned: false },
      // Blog type posts
      {
        title: 'My Journey as a Virtual Content Creator',
        slug: 'my-journey-as-virtual-content-creator',
        postType: 'blog' as const,
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reflecting on the past year.',
        content: {
          root: {
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.' }], version: 1 },
              { type: 'paragraph', children: [{ type: 'text', text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.' }], version: 1 },
            ],
            direction: 'ltr' as const, format: '', indent: 0, version: 1,
          },
        },
        status: 'published' as const,
        publishedAt: '2026-01-10T12:00:00.000Z',
      },
      {
        title: 'Behind the Scenes: Making My First Original Song',
        slug: 'behind-the-scenes-first-original-song',
        postType: 'blog' as const,
        excerpt: 'A look into the creative process behind my debut original song.',
        content: {
          root: {
            type: 'root',
            children: [
              { type: 'paragraph', children: [{ type: 'text', text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae.' }], version: 1 },
            ],
            direction: 'ltr' as const, format: '', indent: 0, version: 1,
          },
        },
        status: 'published' as const,
        publishedAt: '2026-01-05T15:00:00.000Z',
      },
    ]

    for (const post of posts) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await payload.create({ collection: 'posts', data: post as any })
      } catch {
        // Skip duplicates
      }
    }
    results.push(`Posts seeded (${posts.length} items)`)

    // ============================================
    // STEP 14: Seed Livestream Settings
    // ============================================
    const { docs: allSocials } = await payload.find({
      collection: 'socials',
      where: {
        or: [
          { platform: { equals: 'youtube' } },
          { platform: { equals: 'twitch' } },
        ],
      },
    })

    await payload.updateGlobal({
      slug: 'livestream-settings',
      data: {
        enabled: true,
        trackedSocials: allSocials.map((s) => s.id),
        pollingInterval: 60,
        alertDuration: 10,
        showFriendStreams: true,
        alertPosition: 'bottom-right',
      },
    })
    results.push('Livestream Settings seeded')

    return NextResponse.json({
      success: true,
      results,
      mediaUploaded: Object.keys(mediaMap).length,
      message: 'All data seeded successfully with media!',
    })
  } catch (error) {
    console.error('Seed error:', error)
    return NextResponse.json(
      { error: 'Failed to seed data', details: String(error) },
      { status: 500 }
    )
  }
}

// GET endpoint for info
export async function GET() {
  return NextResponse.json({
    info: 'POST to this endpoint with Authorization: Bearer <SEED_SECRET> to seed all data',
    env: 'Set SEED_SECRET environment variable to protect this endpoint',
    seeds: [
      'Media (all files from public/)',
      'Profile global (with person and model)',
      'Themes global (with interactive media)',
      'Site Settings global',
      'Livestream Settings global',
      'Tags (8 items)',
      'Announcements (7 items)',
      'Blog Posts (2 items)',
      'People (6 items with avatars)',
      'Socials (4 items)',
      'Models (2 items with showcase)',
      'Music Tracks (with covers and credits)',
      'Artworks (from remaining images)',
      'Interactive Media (5 items)',
    ],
  })
}
