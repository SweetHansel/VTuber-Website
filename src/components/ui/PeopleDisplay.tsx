'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import {
  getInitials,
  getAvatarColor,
  type Credit,
  getPersonFromCredit,
  getCreditDisplayName,
  groupCreditsByRole,
  normalizeRoleName,
} from '@/lib/people'
import { useModalStore } from '@/stores/modalStore'
import { getMedia } from '@/hooks/useCMS'
import type { Media, Person } from '@/payload-types'

/**
 * Minimal person interface for display
 */
interface PersonLike {
  id: number
  name: string
  roles?: string | null
  avatar?: unknown
}

type Size = 'sm' | 'md' | 'lg'

const sizeClasses = {
  sm: 'h-6 w-6 text-[10px]',
  md: 'h-8 w-8 text-sm',
  lg: 'h-12 w-12 text-base',
}

const sizePx = {
  sm: 24,
  md: 32,
  lg: 48,
}

const overlapClasses = {
  sm: '-ml-2',
  md: '-ml-3',
  lg: '-ml-4',
}

const pillClasses = {
  sm: 'h-6 text-[10px] px-2',
  md: 'h-8 text-sm px-2.5',
  lg: 'h-12 text-base px-3',
}

// ============================================
// Internal Avatar Component
// ============================================

interface AvatarProps {
  person: PersonLike
  size: Size
  showRole?: string
  className?: string
  onClick?: () => void
}

function Avatar({ person, size, showRole, className, onClick }: Readonly<AvatarProps>) {
  const [showTooltip, setShowTooltip] = useState(false)
  const [imageError, setImageError] = useState(false)
  const openModal = useModalStore((s) => s.openModal)

  const avatar = getMedia(person.avatar as number | Media | null | undefined)
  const hasAvatar = avatar?.url && !imageError
  const initials = getInitials(person.name)
  const bgColor = getAvatarColor(person.name)

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      openModal('person', person as Person)
    }
  }

  return (
    <div
      className={cn('relative inline-block', className)}
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <button
        onClick={handleClick}
        className={cn(
          'relative flex items-center justify-center rounded-full font-medium text-white transition-transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-(--modal-primary)/50 focus:ring-offset-2 focus:ring-offset-(--modal-bg)',
          sizeClasses[size],
        )}
        style={{ backgroundColor: hasAvatar ? undefined : bgColor }}
        title={person.name}
      >
        {hasAvatar ? (
          <Image
            src={avatar.url!}
            alt={person.name}
            width={sizePx[size]}
            height={sizePx[size]}
            className="h-full w-full rounded-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          initials
        )}
      </button>

      {/* Tooltip */}
      {showTooltip && (
        <div className="absolute bottom-full left-1/2 z-50 mb-2 -translate-x-1/2 whitespace-nowrap rounded-lg bg-(--modal-bg) px-3 py-1.5 text-base shadow-lg">
          <p className="font-medium text-(--modal-text)">{person.name}</p>
          {showRole && (
            <p className="text-sm text-(--modal-text)/60">{showRole}</p>
          )}
          {!showRole && person.roles && (
            <p className="text-sm text-(--modal-text)/60">{person.roles}</p>
          )}
          <div className="absolute left-1/2 top-full -translate-x-1/2 border-4 border-transparent border-t-(--modal-bg)" />
        </div>
      )}
    </div>
  )
}

// ============================================
// Main PeopleDisplay Component
// ============================================

export interface PeopleDisplayProps {
  /** Array of people to display (simple avatars) */
  people?: PersonLike[]
  /** Array of credits to display (with roles) */
  credits?: Credit[]
  /** Size of avatars */
  size?: Size
  /** Maximum visible avatars before showing +N (only for people mode) */
  maxVisible?: number
  /** Show role labels with credits */
  showRoles?: boolean
  /** Group credits by role */
  groupByRole?: boolean
  /** Layout variant */
  variant?: 'stack' | 'pills' | 'list'
  className?: string
}

export function PeopleDisplay({
  people,
  credits,
  size = 'md',
  maxVisible = 5,
  showRoles = true,
  groupByRole = false,
  variant = 'stack',
  className,
}: Readonly<PeopleDisplayProps>) {
  const [expanded, setExpanded] = useState(false)

  // Group credits by role if requested
  const groupedCredits = useMemo(() => {
    if (!groupByRole || !credits) return null
    return groupCreditsByRole(credits)
  }, [credits, groupByRole])

  // Handle empty state
  if ((!people || people.length === 0) && (!credits || credits.length === 0)) {
    return null
  }

  // ============================================
  // Credits display (with roles)
  // ============================================
  if (credits && credits.length > 0) {
    // Grouped by role
    if (groupByRole && groupedCredits) {
      return (
        <div className={cn('space-y-3', className)}>
          {Array.from(groupedCredits.entries()).map(([role, roleCredits]) => (
            <div key={role}>
              <p className="mb-1.5 text-sm font-medium uppercase tracking-wide text-(--modal-text)/40">
                {normalizeRoleName(role)}
              </p>
              <div className="flex flex-wrap  gap-4 ">
                {roleCredits.map((credit, index) => {
                  const person = getPersonFromCredit(credit)
                  const displayName = getCreditDisplayName(credit)
                  return (
                    <div
                      key={credit.id || index}
                      className="flex items-center  gap-4 rounded-full bg-(--modal-surface)/10 px-3 py-1.5 text-base"
                    >
                      {person && (
                        <Avatar person={person} size="sm" showRole={role} />
                      )}
                      <span className="text-(--modal-text)">{displayName}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )
    }

    // Pills variant (default for credits)
    return (
      <div className={cn('flex flex-wrap  gap-4 ', className)}>
        {credits.map((credit, index) => {
          const person = getPersonFromCredit(credit)
          const displayName = getCreditDisplayName(credit)
          return (
            <div
              key={credit.id || index}
              className="flex items-center  gap-4 rounded-full bg-(--modal-surface)/10 px-3 py-1.5 text-base"
            >
              {person && (
                <Avatar person={person} size="sm" showRole={credit.role} />
              )}
              {showRoles && (
                <span className="text-(--modal-text)/50">
                  {normalizeRoleName(credit.role)}:
                </span>
              )}
              <span className="text-(--modal-text)">{displayName}</span>
            </div>
          )
        })}
      </div>
    )
  }

  // ============================================
  // People display (simple avatars)
  // ============================================
  if (people && people.length > 0) {
    const visiblePeople = expanded ? people : people.slice(0, maxVisible)
    const overflowCount = people.length - maxVisible
    const hasOverflow = overflowCount > 0 && !expanded

    // Stack variant (default for people)
    if (variant === 'stack') {
      return (
        <div className={cn('flex items-center', className)}>
          {visiblePeople.map((person, index) => (
            <div
              key={person.id}
              className={cn(index > 0 && overlapClasses[size])}
              style={{ zIndex: visiblePeople.length - index }}
            >
              <Avatar
                person={person}
                size={size}
                className="ring-2 ring-(--modal-bg)"
              />
            </div>
          ))}

          {hasOverflow && (
            <button
              onClick={() => setExpanded(true)}
              className={cn(
                'flex items-center justify-center rounded-full bg-(--modal-surface)/20 font-medium text-(--modal-text)/70 ring-2 ring-(--modal-bg) transition-colors hover:bg-(--modal-surface)/30 hover:text-(--modal-text)',
                overlapClasses[size],
                pillClasses[size],
              )}
              style={{ zIndex: 0 }}
            >
              +{overflowCount}
            </button>
          )}

          {expanded && people.length > maxVisible && (
            <button
              onClick={() => setExpanded(false)}
              className="ml-2 text-sm text-(--modal-text)/50 hover:text-(--modal-text)/70"
            >
              Show less
            </button>
          )}
        </div>
      )
    }

    // Pills variant for people
    return (
      <div className={cn('flex flex-wrap  gap-4 ', className)}>
        {people.map((person) => (
          <div
            key={person.id}
            className="flex items-center  gap-4 rounded-full bg-(--modal-surface)/10 px-3 py-1.5 text-base"
          >
            <Avatar person={person} size="sm" />
            <span className="text-(--modal-text)">{person.name}</span>
          </div>
        ))}
      </div>
    )
  }

  return null
}
