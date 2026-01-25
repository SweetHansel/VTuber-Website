import { NextResponse } from 'next/server'

// Protect with a secret - set SEED_SECRET env var in Vercel
const SEED_SECRET = process.env.SEED_SECRET || 'dev-seed-secret'

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

    // Seed Profile global
    await payload.updateGlobal({
      slug: 'profile',
      data: {
        name: 'Lorem Ipsum',
        japaneseName: 'ロレム・イプサム',
        tagline: 'Lorem ipsum dolor sit amet.',
        shortBio: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla interdum dapibus metus, at vestibulum magna venenatis sit amet. Suspendisse potenti. Aliquam quis tempor velit.',
        birthday: '2025-03-15T00:00:00.000Z',
        height: '160cm',
        traits: [
          {
            category: 'Hobbies',
            icon: 'Gamepad',
            color: '#3b82f6',
            items: [
              { value: 'Lorem' },
              { value: 'Ipsum' },
              { value: 'Dolor' },
              { value: 'Sit' },
            ],
          },
          {
            category: 'Likes',
            icon: 'Heart',
            color: '#ec4899',
            items: [
              { value: 'Amet' },
              { value: 'Consectetur' },
              { value: 'Adipiscing' },
              { value: 'Elit' },
            ],
          },
          {
            category: 'Dislikes',
            icon: 'ThumbsDown',
            color: '#ef4444',
            items: [
              { value: 'Nulla interdum' },
              { value: 'Dapibus metus' },
              { value: 'At vestibulum' },
            ],
          },
        ],
        hashtags: {
          general: '#LoremIpsum',
          fanart: '#LoremIpsumArt',
          stream: '#LoremIpsumLive',
          fanName: 'PlaceHolders',
        },
        socialLinks: [
          { platform: 'twitter', url: 'https://twitter.com/loremipsum', label: 'Twitter' },
          { platform: 'youtube', url: 'https://youtube.com/@loremipsum', label: 'YouTube' },
          { platform: 'twitch', url: 'https://twitch.tv/loremipsum', label: 'Twitch' },
          { platform: 'discord', url: 'https://discord.gg/loremipsum', label: 'Discord' },
        ],
      },
    })
    results.push('Profile seeded')

    // Seed Themes global (colors only)
    await payload.updateGlobal({
      slug: 'themes',
      data: {
        primaryColor: '#3b82f6',
        secondaryColor: '#8b5cf6',
        accentColor: '#ec4899',
      },
    })
    results.push('Themes seeded')

    // Seed Site Settings global
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

    // Seed Tags
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

    // Seed Announcements
    const announcements = [
      {
        title: 'New Year Countdown Stream 2026!',
        type: 'stream' as const,
        eventDate: '2026-01-01T23:00:00.000Z',
        location: 'YouTube Live',
        externalLink: 'https://youtube.com/@loremipsum',
        priority: 10,
        isPinned: true,
      },
      {
        title: 'New Original Song Release - "Placeholder Dreams"',
        type: 'release' as const,
        priority: 9,
        isPinned: true,
      },
      {
        title: 'Collaboration Stream with Friends',
        type: 'collab' as const,
        eventDate: '2026-01-20T20:00:00.000Z',
        location: 'Twitch',
        priority: 7,
        isPinned: false,
      },
      {
        title: 'Milestone Celebration: 100k Subscribers!',
        type: 'event' as const,
        eventDate: '2026-02-01T19:00:00.000Z',
        location: 'YouTube Live',
        priority: 8,
        isPinned: false,
      },
      {
        title: 'Weekly Gaming Stream Schedule Update',
        type: 'general' as const,
        priority: 5,
        isPinned: false,
      },
      {
        title: 'Fan Art Contest Announcement',
        type: 'event' as const,
        eventDate: '2026-02-14T00:00:00.000Z',
        externalLink: 'https://twitter.com/loremipsum',
        priority: 6,
        isPinned: false,
      },
      {
        title: 'Birthday Stream Coming Soon!',
        type: 'stream' as const,
        eventDate: '2026-03-15T20:00:00.000Z',
        location: 'YouTube Live',
        priority: 10,
        isPinned: false,
      },
    ]

    for (const ann of announcements) {
      try {
        await payload.create({ collection: 'announcements', data: ann })
      } catch {
        // Skip duplicates
      }
    }
    results.push(`Announcements seeded (${announcements.length} items)`)

    // Seed Blog Posts
    const blogPosts = [
      {
        title: 'My Journey as a Virtual Content Creator',
        slug: 'my-journey-as-virtual-content-creator',
        excerpt: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Reflecting on the past year and all the amazing memories.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.' }],
                version: 1,
              },
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.' }],
                version: 1,
              },
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        status: 'published' as const,
        publishedAt: '2026-01-10T12:00:00.000Z',
      },
      {
        title: 'Behind the Scenes: Making My First Original Song',
        slug: 'behind-the-scenes-first-original-song',
        excerpt: 'A look into the creative process behind my debut original song.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae. Donec velit neque, auctor sit amet aliquam vel, ullamcorper sit amet ligula.' }],
                version: 1,
              },
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Praesent sapien massa, convallis a pellentesque nec, egestas non nisi. Curabitur arcu erat, accumsan id imperdiet et, porttitor at sem.' }],
                version: 1,
              },
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        status: 'published' as const,
        publishedAt: '2026-01-05T15:00:00.000Z',
      },
      {
        title: 'Thank You for 50,000 Subscribers!',
        slug: 'thank-you-50k-subscribers',
        excerpt: 'A heartfelt thank you to everyone who has supported me on this journey.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Nulla quis lorem ut libero malesuada feugiat. Mauris blandit aliquet elit, eget tincidunt nibh pulvinar a. Cras ultricies ligula sed magna dictum porta.' }],
                version: 1,
              },
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        status: 'published' as const,
        publishedAt: '2025-12-20T10:00:00.000Z',
      },
      {
        title: 'Upcoming Projects for 2026',
        slug: 'upcoming-projects-2026',
        excerpt: 'Exciting things are coming! Here is a sneak peek at what I have planned.',
        content: {
          root: {
            type: 'root',
            children: [
              {
                type: 'paragraph',
                children: [{ type: 'text', text: 'Pellentesque in ipsum id orci porta dapibus. Vivamus suscipit tortor eget felis porttitor volutpat. Curabitur non nulla sit amet nisl tempus convallis quis ac lectus.' }],
                version: 1,
              },
            ],
            direction: 'ltr' as const,
            format: '',
            indent: 0,
            version: 1,
          },
        },
        status: 'published' as const,
        publishedAt: '2026-01-15T18:00:00.000Z',
      },
    ]

    for (const post of blogPosts) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await payload.create({ collection: 'blog-posts', data: post as any })
      } catch {
        // Skip duplicates
      }
    }
    results.push(`Blog Posts seeded (${blogPosts.length} items)`)

    // Seed People (collaborators, artists, etc.)
    const people = [
      {
        name: 'Artist One',
        bio: 'Talented illustrator specializing in character design and key visuals.',
        roles: ['illustrator' as const],
        socialLinks: [
          { platform: 'twitter' as const, url: 'https://twitter.com/artistone' },
          { platform: 'pixiv' as const, url: 'https://pixiv.net/users/12345' },
        ],
      },
      {
        name: 'Music Producer',
        bio: 'Creates amazing original music and arrangements.',
        roles: ['music-producer' as const],
        socialLinks: [
          { platform: 'twitter' as const, url: 'https://twitter.com/musicproducer' },
          { platform: 'youtube' as const, url: 'https://youtube.com/@musicproducer' },
        ],
      },
      {
        name: 'Rigger San',
        bio: 'Professional Live2D rigger with years of experience.',
        roles: ['rigger' as const],
        socialLinks: [
          { platform: 'twitter' as const, url: 'https://twitter.com/riggersan' },
        ],
      },
      {
        name: 'Video Editor',
        bio: 'Creates engaging video content and motion graphics.',
        roles: ['video-editor' as const, 'animator' as const],
        socialLinks: [
          { platform: 'twitter' as const, url: 'https://twitter.com/videoeditor' },
        ],
      },
      {
        name: 'Mixer Engineer',
        bio: 'Audio engineer specializing in vocal mixing and mastering.',
        roles: ['mixer' as const],
        socialLinks: [
          { platform: 'twitter' as const, url: 'https://twitter.com/mixerengineer' },
        ],
      },
    ]

    for (const person of people) {
      try {
        await payload.create({ collection: 'people', data: person })
      } catch {
        // Skip duplicates
      }
    }
    results.push(`People seeded (${people.length} items)`)

    // Seed Channels (for livestream tracking)
    const channels = [
      {
        name: 'Main YouTube Channel',
        platform: 'youtube' as const,
        channelId: 'UC_placeholder_channel_id',
        channelUrl: 'https://youtube.com/@loremipsum',
        trackLivestream: true,
        priority: 1,
      },
      {
        name: 'Twitch Channel',
        platform: 'twitch' as const,
        channelId: 'loremipsum',
        channelUrl: 'https://twitch.tv/loremipsum',
        trackLivestream: true,
        priority: 2,
      },
    ]

    for (const channel of channels) {
      try {
        await payload.create({ collection: 'channels', data: channel })
      } catch {
        // Skip duplicates
      }
    }
    results.push(`Channels seeded (${channels.length} items)`)

    // Seed Livestream Settings
    await payload.updateGlobal({
      slug: 'livestream-settings',
      data: {
        enabled: true,
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
      message: 'Placeholder data seeded successfully. Upload media files via /admin to add images.',
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
    info: 'POST to this endpoint with Authorization: Bearer <SEED_SECRET> to seed placeholder data',
    env: 'Set SEED_SECRET environment variable to protect this endpoint',
    seeds: [
      'Profile global',
      'Themes global (colors)',
      'Site Settings global',
      'Livestream Settings global',
      'Tags (8 items)',
      'Announcements (7 items)',
      'Blog Posts (4 items)',
      'People (5 items)',
      'Channels (2 items)',
    ],
    note: 'Media-dependent items (artworks, music tracks, interactive media, models) must be created manually after uploading files.',
  })
}
