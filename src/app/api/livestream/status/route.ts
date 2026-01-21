import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

interface TrackedChannel {
  id: string
  name: string
  platform: 'twitch' | 'youtube'
  channelId: string
  channelUrl: string
  isOwner?: boolean | null
  priority?: number | null
  enabled?: boolean | null
}

interface LiveStream {
  channelId: string
  channelName: string
  platform: 'twitch' | 'youtube'
  streamUrl: string
  title: string
  thumbnail?: string
  viewerCount?: number
  isOwner: boolean
  priority: number
}

export async function GET() {
  try {
    const payload = await getPayload({ config })

    // Get all enabled tracked channels from CMS
    const { docs: channels } = await payload.find({
      collection: 'tracked-channels',
      where: {
        enabled: {
          equals: true,
        },
      },
      limit: 50,
    })

    if (channels.length === 0) {
      return NextResponse.json({ streams: [], isLive: false })
    }

    const streams: LiveStream[] = []

    // Type assertion for channels
    const typedChannels = channels as unknown as TrackedChannel[]

    // Check Twitch channels
    const twitchChannels = typedChannels.filter((c) => c.platform === 'twitch')
    if (twitchChannels.length > 0) {
      try {
        const twitchStreams = await checkTwitchStreams(twitchChannels)
        streams.push(...twitchStreams)
      } catch (error) {
        console.error('Twitch API error:', error)
      }
    }

    // Check YouTube channels
    const youtubeChannels = typedChannels.filter((c) => c.platform === 'youtube')
    if (youtubeChannels.length > 0) {
      try {
        const youtubeStreams = await checkYouTubeStreams(youtubeChannels)
        streams.push(...youtubeStreams)
      } catch (error) {
        console.error('YouTube API error:', error)
      }
    }

    // Check for manual override
    const livestreamSettings = await payload.findGlobal({
      slug: 'livestream-settings',
    })

    if (livestreamSettings?.manualOverride?.isLive) {
      const override = livestreamSettings.manualOverride
      streams.unshift({
        channelId: 'manual-override',
        channelName: 'Manual Override',
        platform: (override.platform as 'twitch' | 'youtube') || 'youtube',
        streamUrl: override.streamUrl || '',
        title: override.streamTitle || 'Live Now!',
        thumbnail:
          typeof override.thumbnail === 'object'
            ? override.thumbnail.url || undefined
            : undefined,
        isOwner: true,
        priority: 999,
      })
    }

    // Sort by priority (owner first, then by priority number)
    streams.sort((a, b) => {
      if (a.isOwner !== b.isOwner) return a.isOwner ? -1 : 1
      return b.priority - a.priority
    })

    return NextResponse.json({
      streams,
      isLive: streams.length > 0,
      checkedAt: new Date().toISOString(),
    })
  } catch (error) {
    console.error('Livestream status check failed:', error)
    return NextResponse.json(
      { error: 'Failed to check livestream status' },
      { status: 500 }
    )
  }
}

async function checkTwitchStreams(
  channels: Array<{
    channelId: string
    name: string
    channelUrl: string
    isOwner?: boolean | null
    priority?: number | null
  }>
): Promise<LiveStream[]> {
  const clientId = process.env.TWITCH_CLIENT_ID
  const clientSecret = process.env.TWITCH_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    console.warn('Twitch API credentials not configured')
    return []
  }

  // Get access token
  const tokenRes = await fetch(
    `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${clientSecret}&grant_type=client_credentials`,
    { method: 'POST' }
  )

  if (!tokenRes.ok) {
    throw new Error('Failed to get Twitch access token')
  }

  const { access_token } = await tokenRes.json()

  // Get stream status for all channels
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

  return liveStreams.map((stream: any) => {
    const channel = channels.find(
      (c) => c.channelId.toLowerCase() === stream.user_login.toLowerCase()
    )
    return {
      channelId: stream.user_login,
      channelName: stream.user_name,
      platform: 'twitch' as const,
      streamUrl: `https://twitch.tv/${stream.user_login}`,
      title: stream.title,
      thumbnail: stream.thumbnail_url
        ?.replace('{width}', '440')
        .replace('{height}', '248'),
      viewerCount: stream.viewer_count,
      isOwner: channel?.isOwner || false,
      priority: channel?.priority || 1,
    }
  })
}

async function checkYouTubeStreams(
  channels: Array<{
    channelId: string
    name: string
    channelUrl: string
    isOwner?: boolean | null
    priority?: number | null
  }>
): Promise<LiveStream[]> {
  const apiKey = process.env.YOUTUBE_API_KEY

  if (!apiKey) {
    console.warn('YouTube API key not configured')
    return []
  }

  const streams: LiveStream[] = []

  // Check each channel for live streams
  for (const channel of channels) {
    try {
      // Search for live broadcasts from this channel
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
          isOwner: channel.isOwner || false,
          priority: channel.priority || 1,
        })
      }
    } catch (error) {
      console.error(`Failed to check YouTube channel ${channel.channelId}:`, error)
    }
  }

  return streams
}
