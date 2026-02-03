// Configuration constants - single source of truth
// Used in: useCMS, LivestreamAlert, and other components with caching/polling

/**
 * Cache duration for CMS data fetches (in milliseconds)
 * 1 minute = 60000ms
 */
export const CACHE_DURATION_MS = 60000

/**
 * Polling interval for real-time data like livestream status (in milliseconds)
 * 1 minute = 60000ms
 */
export const POLLING_INTERVAL_MS = 60000

/**
 * Default API fetch timeout (in milliseconds)
 */
export const API_TIMEOUT_MS = 10000
