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
        name: 'Hikari Hoshi',
        japaneseName: '星ひかり',
        tagline: 'Virtual Singer & Streamer',
        shortBio: 'A cheerful virtual streamer who loves singing, gaming, and chatting with fans! From the stars to your screen, spreading joy and music across the digital cosmos!',
        birthday: '2025-03-15T00:00:00.000Z',
        height: '158cm',
        traits: [
          {
            category: 'Hobbies',
            icon: 'Gamepad',
            color: '#3b82f6',
            items: [
              { value: 'Singing' },
              { value: 'Gaming' },
              { value: 'Drawing' },
              { value: 'Cooking' },
            ],
          },
          {
            category: 'Likes',
            icon: 'Heart',
            color: '#ec4899',
            items: [
              { value: 'Music' },
              { value: 'Cats' },
              { value: 'Strawberries' },
              { value: 'Anime' },
            ],
          },
          {
            category: 'Dislikes',
            icon: 'ThumbsDown',
            color: '#ef4444',
            items: [
              { value: 'Spicy food' },
              { value: 'Bugs' },
              { value: 'Early mornings' },
            ],
          },
        ],
        hashtags: {
          general: '#HikariHoshi',
          fanart: '#HikariArt',
          stream: '#HikariLive',
          fanName: 'Stargazers',
        },
        socialLinks: [
          { platform: 'twitter', url: 'https://twitter.com/hikarihoshi', label: 'Twitter' },
          { platform: 'youtube', url: 'https://youtube.com/@hikarihoshi', label: 'YouTube' },
          { platform: 'twitch', url: 'https://twitch.tv/hikarihoshi', label: 'Twitch' },
          { platform: 'discord', url: 'https://discord.gg/hikarihoshi', label: 'Discord' },
        ],
      },
    })
    results.push('Profile seeded')

    // Seed Themes global
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
        siteName: 'Hikari Hoshi Official Site',
        siteDescription: 'Official website for Hikari Hoshi - Virtual Singer & Streamer',
        seo: {
          defaultTitle: 'Hikari Hoshi - Virtual Singer & Streamer',
          titleTemplate: '%s | Hikari Hoshi',
        },
      },
    })
    results.push('Site Settings seeded')

    // Seed Announcements
    const announcements = [
      {
        title: 'New Year Stream 2026!',
        type: 'stream' as const,
        eventDate: '2026-01-01T23:00:00.000Z',
        location: 'YouTube Live',
        externalLink: 'https://youtube.com/@hikarihoshi',
        priority: 10,
        isPinned: true,
      },
      {
        title: 'New Original Song Release',
        type: 'release' as const,
        priority: 8,
        isPinned: false,
      },
      {
        title: 'Collaboration Stream with Friends',
        type: 'collab' as const,
        eventDate: '2026-01-20T20:00:00.000Z',
        location: 'Twitch',
        priority: 7,
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
    results.push('Announcements seeded')

    // Seed Interactive Media
    const interactiveMedia = [
      { name: 'Main Character - Landing', location: 'landing-character', defaultState: { alt: 'Character idle' }, depth: -20 },
      { name: 'Phone Frame - Left Panel', location: 'landing-left', defaultState: { alt: 'Phone frame' }, depth: -10 },
      { name: 'Discography Character', location: 'page-discography', defaultState: { alt: 'Discography character' }, depth: -40 },
      { name: 'Artworks Character', location: 'page-artworks', defaultState: { alt: 'Artworks character' }, depth: -30 },
    ]

    for (const media of interactiveMedia) {
      try {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        await (payload as any).create({ collection: 'interactive-media', data: media })
      } catch {
        // Skip if exists (unique constraint)
      }
    }
    results.push('Interactive Media seeded')

    return NextResponse.json({
      success: true,
      results,
      message: 'Placeholder data seeded successfully. Upload media files via /admin to complete setup.',
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
  })
}
