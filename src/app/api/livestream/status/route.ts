import { NextResponse } from 'next/server'

interface LiveStream {
  channelId: string
  channelName: string
  platform: 'twitch' | 'youtube'
  streamUrl: string
  title: string
  thumbnail?: string
  viewerCount?: number
  priority: number
}

interface Channel {
  name: string
  platform: 'twitch' | 'youtube' | 'tiktok'
  channelId: string
  channelUrl: string
  priority?: number | null
  trackLivestream?: boolean | null
}

async function getChannelsFromCMS(): Promise<Channel[]> {
  try {
    // Dynamic import to avoid module resolution issues at build time
    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)

    const payload = await getPayload({ config })

    const { docs: channels } = await payload.find({
      collection: 'channels',
      where: {
        trackLivestream: { equals: true },
      },
      limit: 50,
    })

    return channels as unknown as Channel[]
  } catch (error) {
    console.warn('Could not fetch channels from CMS, using fallback:', error)
    return []
  }
}

async function getManualOverrideFromCMS(): Promise<{
  isLive: boolean
  platform?: string
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
        platform?: string
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

    // Try to get channels from CMS first
    const channels = await getChannelsFromCMS()

    // If no channels from CMS, the array will be empty - that's fine
    // The frontend will just show no live streams

    // Check Twitch channels
    const twitchChannels = channels.filter((c) => c.platform === 'twitch')
    if (twitchChannels.length > 0) {
      try {
        const twitchStreams = await checkTwitchStreams(twitchChannels)
        streams.push(...twitchStreams)
      } catch (error) {
        console.error('Twitch API error:', error)
      }
    }

    // Check YouTube channels
    const youtubeChannels = channels.filter((c) => c.platform === 'youtube')
    if (youtubeChannels.length > 0) {
      try {
        const youtubeStreams = await checkYouTubeStreams(youtubeChannels)
        streams.push(...youtubeStreams)
      } catch (error) {
        console.error('YouTube API error:', error)
      }
    }

    // Check for manual override from CMS
    const override = await getManualOverrideFromCMS()
    if (override?.isLive) {
      streams.unshift({
        channelId: 'manual-override',
        channelName: 'Live Now',
        platform: (override.platform as 'twitch' | 'youtube') || 'youtube',
        streamUrl: override.streamUrl || '',
        title: override.streamTitle || 'Live Now!',
        thumbnail: override.thumbnail?.url,
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

async function checkTwitchStreams(channels: Channel[]): Promise<LiveStream[]> {
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

  const userLogins = channels.map((c) => c.channelId).join('&user_login=')
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

  return (liveStreams || []).map((stream: Record<string, unknown>) => {
    const channel = channels.find(
      (c) => c.channelId.toLowerCase() === String(stream.user_login).toLowerCase()
    )
    return {
      channelId: String(stream.user_login),
      channelName: String(stream.user_name),
      platform: 'twitch' as const,
      streamUrl: `https://twitch.tv/${stream.user_login}`,
      title: String(stream.title),
      thumbnail: String(stream.thumbnail_url || '')
        .replace('{width}', '440')
        .replace('{height}', '248') || undefined,
      viewerCount: Number(stream.viewer_count) || 0,
      priority: channel?.priority || 1,
    }
  })
}

async function checkYouTubeStreams(channels: Channel[]): Promise<LiveStream[]> {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    console.warn('YouTube API key not configured')
    return []
  }

  const streams: LiveStream[] = []

  for (const channel of channels) {
    try {
      const searchRes = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channel.channelId}&eventType=live&type=video&key=${apiKey}`
      )

      if (!searchRes.ok) continue

      const { items } = await searchRes.json()

      if (items && items.length > 0) {
        const liveVideo = items[0]
        streams.push({
          channelId: channel.channelId,
          channelName: channel.name,
          platform: 'youtube',
          streamUrl: `https://youtube.com/watch?v=${liveVideo.id.videoId}`,
          title: liveVideo.snippet.title,
          thumbnail: liveVideo.snippet.thumbnails?.high?.url,
          priority: channel.priority || 1,
        })
      }
    } catch (error) {
      console.error(`Failed to check YouTube channel ${channel.channelId}:`, error)
    }
  }

  return streams
}
