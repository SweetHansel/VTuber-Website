import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { getPayload } = await import('payload')
    const config = await import('@payload-config').then((m) => m.default)
    const payload = await getPayload({ config })

    // Get cookies from request
    const cookieHeader = request.headers.get('cookie') || ''
    const hasPayloadToken = cookieHeader.includes('payload-token')

    // Try to get the user from the request
    // Count users in database
    const { totalDocs: userCount } = await payload.count({ collection: 'users' })

    // Try to find user by token if present
    let tokenInfo = null
    if (hasPayloadToken) {
      const tokenMatch = cookieHeader.match(/payload-token=([^;]+)/)
      if (tokenMatch) {
        tokenInfo = {
          tokenPresent: true,
          tokenLength: tokenMatch[1].length,
          tokenPreview: tokenMatch[1].substring(0, 20) + '...',
        }
      }
    }

    return NextResponse.json({
      debug: true,
      hasPayloadToken,
      tokenInfo,
      userCount,
      cookieHeaderLength: cookieHeader.length,
      timestamp: new Date().toISOString(),
      env: {
        hasPayloadSecret: !!process.env.PAYLOAD_SECRET,
        payloadSecretLength: process.env.PAYLOAD_SECRET?.length || 0,
        hasServerUrl: !!process.env.NEXT_PUBLIC_SERVER_URL,
        serverUrl: process.env.NEXT_PUBLIC_SERVER_URL || 'not set',
      },
    })
  } catch (error) {
    return NextResponse.json({
      error: 'Debug failed',
      message: String(error),
    }, { status: 500 })
  }
}
