import { NextResponse } from 'next/server'
import type { LiveStream } from '@/constants/livestream'

interface Social {
  id: number
  name: string
  platform: 'twitter' | 'bluesky' | 'youtube' | 'twitch' | 'instagram' | 'tiktok' | 'pixiv' | 'vgen' | 'website' | 'other'
  url: string
}

async function getTrackedSocialsFromCMS(): Promise<Social[]> {
  try {
    // Dynamic import to avoid module resolution issues at build time
    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)

    const payload = await getPayload({ config })

    const settings = await payload.findGlobal({
      slug: 'livestream-settings',
      depth: 1,
    })

    // Filter to only YouTube/Twitch entries for livestream checking
    const trackedSocials = (settings?.trackedSocials || []) as Social[]
    return trackedSocials.filter(
      (s) => s.platform === 'youtube' || s.platform === 'twitch'
    )
  } catch (error) {
    console.warn('Could not fetch tracked socials from CMS, using fallback:', error)
    return []
  }
}

async function getManualOverrideFromCMS(): Promise<{
  isLive: boolean
  streamUrl?: string
  streamTitle?: string
  thumbnail?: { url?: string }
} | null> {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)

    const payload = await getPayload({ config })

    const settings = await payload.findGlobal({
      slug: 'livestream-settings',
    })

    if (settings?.manualOverride?.isLive) {
      return settings.manualOverride as {
        isLive: boolean
        streamUrl?: string
        streamTitle?: string
        thumbnail?: { url?: string }
      }
    }
    return null
  } catch (error) {
    console.warn('Could not fetch livestream settings from CMS:', error)
    return null
  }
}

export async function GET() {
  try {
    const streams: LiveStream[] = []

    // Get tracked socials from CMS
    const trackedSocials = await getTrackedSocialsFromCMS()

    // Check Twitch socials
    const twitchSocials = trackedSocials.filter((s) => s.platform === 'twitch')
    if (twitchSocials.length > 0) {
      try {
        const twitchStreams = await checkTwitchStreams(twitchSocials)
        streams.push(...twitchStreams)
      } catch (error) {
        console.error('Twitch API error:', error)
      }
    }

    // Check YouTube socials
    const youtubeSocials = trackedSocials.filter((s) => s.platform === 'youtube')
    if (youtubeSocials.length > 0) {
      try {
        const youtubeStreams = await checkYouTubeStreams(youtubeSocials)
        streams.push(...youtubeStreams)
      } catch (error) {
        console.error('YouTube API error:', error)
      }
    }

    // Check for manual override from CMS
    const override = await getManualOverrideFromCMS()
    if (override?.isLive) {
      // Determine platform from URL
      const url = override.streamUrl || ''
      const platform: 'twitch' | 'youtube' = url.includes('twitch') ? 'twitch' : 'youtube'

      streams.unshift({
        channelId: 'manual-override',
        channelName: 'Live Now',
        platform,
        streamUrl: override.streamUrl || '',
        title: override.streamTitle || 'Live Now!',
        thumbnail: override.thumbnail?.url,
        isOwner: true,
        priority: 999,
      })
    }

    // Sort by priority (higher priority first)
    streams.sort((a, b) => b.priority - a.priority)

    return NextResponse.json({
      streams,
      isLive: streams.length > 0,
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Livestream status check failed:', error)
    // Return empty state instead of error - more graceful for frontend
    return NextResponse.json({
      streams: [],
      isLive: false,
      checkedAt: new Date().toISOString(),
      error: 'Service temporarily unavailable',
    })
  }
}

// Extract channel/user ID from URL
function extractChannelId(url: string, platform: string): string {
  if (platform === 'twitch') {
    // https://twitch.tv/username -> username
    const match = url.match(/twitch\.tv\/([^/?]+)/)
    return match?.[1] || ''
  }
  if (platform === 'youtube') {
    // https://youtube.com/channel/UC... or https://youtube.com/@username
    const channelMatch = url.match(/youtube\.com\/channel\/([^/?]+)/)
    if (channelMatch) return channelMatch[1]
    // For @username format, we'd need to resolve it via API
    const handleMatch = url.match(/youtube\.com\/@([^/?]+)/)
    return handleMatch?.[1] || ''
  }
  return ''
}

async function checkTwitchStreams(socials: Social[]): Promise<LiveStream[]> {
  const clientId = process.env.TWITCH_CLIENT_ID
  const clientSecret = process.env.TWITCH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.warn('Twitch API credentials not configured')
    return []
  }

  const tokenRes = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: 'POST' }
  )

  if (!tokenRes.ok) {
    throw new Error('Failed to get Twitch access token')
  }

  const { access_token } = await tokenRes.json()

  const userLogins = socials
    .map((s) => extractChannelId(s.url, 'twitch'))
    .filter(Boolean)
    .join('&user_login=')

  if (!userLogins) return []

  const streamsRes = await fetch(
    `https://api.twitch.tv/helix/streams?user_login=${userLogins}`,
    {
      headers: {
        Authorization: `Bearer ${access_token}`,
        'Client-Id': clientId,
      },
    }
  )

  if (!streamsRes.ok) {
    throw new Error('Failed to get Twitch streams')
  }

  const { data: liveStreams } = await streamsRes.json()

  return (liveStreams || []).map((stream: Record<string, unknown>, index: number) => {
    const social = socials.find(
      (s) => extractChannelId(s.url, 'twitch').toLowerCase() === String(stream.user_login).toLowerCase()
    )
    return {
      channelId: String(stream.user_login),
      channelName: social?.name || String(stream.user_name),
      platform: 'twitch' as const,
      streamUrl: `https://twitch.tv/${stream.user_login}`,
      title: String(stream.title),
      thumbnail: String(stream.thumbnail_url || '')
        .replace('{width}', '440')
        .replace('{height}', '248') || undefined,
      viewerCount: Number(stream.viewer_count) || 0,
      isOwner: true,
      priority: index + 1,
    }
  })
}

async function checkYouTubeStreams(socials: Social[]): Promise<LiveStream[]> {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    console.warn('YouTube API key not configured')
    return []
  }

  const streams: LiveStream[] = []

  for (const social of socials) {
    try {
      const channelId = extractChannelId(social.url, 'youtube')
      if (!channelId) continue

      // For @username format, we need to get the channel ID first
      let actualChannelId = channelId
      if (!channelId.startsWith('UC')) {
        // This is a handle, need to resolve it
        const channelRes = await fetch(
          `https://www.googleapis.com/youtube/v3/channels?part=id&forHandle=${channelId}&key=${apiKey}`
        )
        if (channelRes.ok) {
          const { items } = await channelRes.json()
          if (items?.[0]?.id) {
            actualChannelId = items[0].id
          }
        }
      }

      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${actualChannelId}&eventType=live&type=video&key=${apiKey}`
      )

      if (!searchRes.ok) continue

      const { items } = await searchRes.json()

      if (items && items.length > 0) {
        const liveVideo = items[0]
        streams.push({
          channelId: actualChannelId,
          channelName: social.name,
          platform: 'youtube',
          streamUrl: `https://youtube.com/watch?v=${liveVideo.id.videoId}`,
          title: liveVideo.snippet.title,
          thumbnail: liveVideo.snippet.thumbnails?.high?.url,
          isOwner: true,
          priority: streams.length + 1,
        })
      }
    } catch (error) {
      console.error(`Failed to check YouTube social ${social.name}:`, error)
    }
  }

  return streams
}
