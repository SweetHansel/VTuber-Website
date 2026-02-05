/**
 * Get initials from a name
 * "John Doe" -> "JD", "Alice" -> "A"
 */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase()
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase()
}

/**
 * Generate a consistent color from a name using a simple hash
 * Returns a HSL color string with good saturation and lightness for avatars
 */
export function getAvatarColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  // Use the hash to generate a hue (0-360)
  const hue = Math.abs(hash) % 360
  // Fixed saturation and lightness for good avatar colors
  return `hsl(${hue}, 65%, 45%)`
}

import type { Media, Social, Tag } from '@/payload-types'

/**
 * Partial person type for credits (may not have all fields populated)
 * Extends to be compatible with the full Person type
 */
export interface PartialPerson {
  id: number
  name: string
  roles?: string | null
  avatar?: number | Media | null
  bio?: string | null
  socials?: (number | Social)[] | null
  tags?: (number | Tag)[] | null
  updatedAt?: string
  createdAt?: string
}

/**
 * Credit type that handles both 'artist' (Models/MusicTracks) and 'person' (Artworks/Videos) fields
 */
export interface Credit {
  role: string
  artist?: PartialPerson | number | null
  person?: PartialPerson | number | null
  name?: string | null
  id?: string | null
}

/**
 * Extract Person object from a credit entry
 * Handles both 'artist' and 'person' field variations
 */
export function getPersonFromCredit(credit: Credit): PartialPerson | undefined {
  // Check 'artist' field (used by Models, MusicTracks)
  const artist = credit.artist
  if (artist && typeof artist === 'object') {
    return artist
  }

  // Check 'person' field (used by Artworks, Videos)
  const person = credit.person
  if (person && typeof person === 'object') {
    return person
  }

  return undefined
}

/**
 * Get display name from a credit entry
 * Priority: resolved person/artist name > manual name > "Unknown"
 */
export function getCreditDisplayName(credit: Credit): string {
  const person = getPersonFromCredit(credit)
  if (person) {
    return person.name
  }
  return credit.name || 'Unknown'
}

/**
 * Group credits by role
 * Returns a Map with role as key and array of credits as value
 */
export function groupCreditsByRole(credits: Credit[]): Map<string, Credit[]> {
  const grouped = new Map<string, Credit[]>()

  for (const credit of credits) {
    const role = credit.role || 'Other'
    const existing = grouped.get(role) || []
    existing.push(credit)
    grouped.set(role, existing)
  }

  return grouped
}

/**
 * Normalize role name for display
 * Capitalizes first letter of each word
 */
export function normalizeRoleName(role: string): string {
  return role
    .split(/[\s-_]+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ')
}
