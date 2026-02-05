'use client'

import { cn } from '@/lib/utils'

/**
 * Lexical content structure from Payload CMS
 */
interface LexicalNode {
  type: string
  version?: number
  children?: LexicalNode[]
  text?: string
  format?: number | string
  tag?: string
  listType?: 'bullet' | 'number' | 'check'
  url?: string
  rel?: string
  target?: string
  direction?: 'ltr' | 'rtl' | null
  indent?: number
  [key: string]: unknown
}

export interface LexicalContent {
  root: {
    type: string
    children: LexicalNode[]
    direction?: 'ltr' | 'rtl' | null
    format?: string
    indent?: number
    version?: number
  }
}

interface RichTextRendererProps {
  content: LexicalContent | unknown | null | undefined
  className?: string
}

// Format bitmask values from Lexical
const FORMAT_BOLD = 1
const FORMAT_ITALIC = 2
const FORMAT_UNDERLINE = 4
const FORMAT_STRIKETHROUGH = 8
const FORMAT_CODE = 16
const FORMAT_SUBSCRIPT = 32
const FORMAT_SUPERSCRIPT = 64

/**
 * Render a text node with formatting
 */
function renderTextNode(node: LexicalNode, key: number): React.ReactNode {
  const text = node.text || ''
  const format = typeof node.format === 'number' ? node.format : 0

  let element: React.ReactNode = text

  if (format & FORMAT_BOLD) {
    element = <strong key={`${key}-bold`}>{element}</strong>
  }
  if (format & FORMAT_ITALIC) {
    element = <em key={`${key}-italic`}>{element}</em>
  }
  if (format & FORMAT_UNDERLINE) {
    element = <u key={`${key}-underline`}>{element}</u>
  }
  if (format & FORMAT_STRIKETHROUGH) {
    element = <s key={`${key}-strike`}>{element}</s>
  }
  if (format & FORMAT_CODE) {
    element = (
      <code
        key={`${key}-code`}
        className="rounded bg-(--modal-surface)/20 px-1.5 py-0.5 font-mono text-sm"
      >
        {element}
      </code>
    )
  }
  if (format & FORMAT_SUBSCRIPT) {
    element = <sub key={`${key}-sub`}>{element}</sub>
  }
  if (format & FORMAT_SUPERSCRIPT) {
    element = <sup key={`${key}-sup`}>{element}</sup>
  }

  return element
}

/**
 * Render children nodes recursively
 */
function renderChildren(children: LexicalNode[] | undefined): React.ReactNode[] {
  if (!children) return []

  return children.map((child, index) => renderNode(child, index))
}

/**
 * Render a single Lexical node
 */
function renderNode(node: LexicalNode, key: number): React.ReactNode {
  switch (node.type) {
    case 'text':
      return renderTextNode(node, key)

    case 'paragraph':
      return (
        <p key={key} className="mb-3 last:mb-0">
          {renderChildren(node.children)}
        </p>
      )

    case 'heading': {
      const tag = node.tag || 'h2'
      const headingClasses: Record<string, string> = {
        h1: 'text-2xl font-bold mb-4',
        h2: 'text-xl font-bold mb-3',
        h3: 'text-lg font-semibold mb-3',
        h4: 'text-base font-semibold mb-2',
        h5: 'text-sm font-semibold mb-2',
        h6: 'text-sm font-medium mb-2',
      }
      const className = headingClasses[tag] || headingClasses.h2
      const children = renderChildren(node.children)
      switch (tag) {
        case 'h1': return <h1 key={key} className={className}>{children}</h1>
        case 'h3': return <h3 key={key} className={className}>{children}</h3>
        case 'h4': return <h4 key={key} className={className}>{children}</h4>
        case 'h5': return <h5 key={key} className={className}>{children}</h5>
        case 'h6': return <h6 key={key} className={className}>{children}</h6>
        default: return <h2 key={key} className={className}>{children}</h2>
      }
    }

    case 'list': {
      const ListTag = node.listType === 'number' ? 'ol' : 'ul'
      const listClass = node.listType === 'number'
        ? 'list-decimal list-inside mb-3 space-y-1'
        : 'list-disc list-inside mb-3 space-y-1'
      return (
        <ListTag key={key} className={listClass}>
          {renderChildren(node.children)}
        </ListTag>
      )
    }

    case 'listitem':
      return <li key={key}>{renderChildren(node.children)}</li>

    case 'link':
    case 'autolink':
      return (
        <a
          key={key}
          href={node.url || '#'}
          target={node.target || '_blank'}
          rel={node.rel || 'noopener noreferrer'}
          className="text-(--modal-primary) underline hover:no-underline"
        >
          {renderChildren(node.children)}
        </a>
      )

    case 'quote':
      return (
        <blockquote
          key={key}
          className="mb-3 border-l-4 border-(--modal-surface)/30 pl-4 italic text-(--modal-text)/70"
        >
          {renderChildren(node.children)}
        </blockquote>
      )

    case 'horizontalrule':
      return <hr key={key} className="my-4 border-(--modal-surface)/20" />

    case 'linebreak':
      return <br key={key} />

    default:
      // For unknown node types, try to render children if present
      if (node.children) {
        return <span key={key}>{renderChildren(node.children)}</span>
      }
      return null
  }
}

/**
 * Type guard to check if content is valid LexicalContent
 */
function isLexicalContent(content: unknown): content is LexicalContent {
  if (!content || typeof content !== 'object') return false
  const c = content as Record<string, unknown>
  if (!c.root || typeof c.root !== 'object') return false
  const root = c.root as Record<string, unknown>
  return Array.isArray(root.children)
}

/**
 * Render Lexical rich text content from Payload CMS
 */
export function RichTextRenderer({ content, className }: Readonly<RichTextRendererProps>) {
  if (!isLexicalContent(content)) {
    return null
  }

  return (
    <div className={cn('text-(--modal-text)/80 leading-relaxed', className)}>
      {content.root.children.map((node, index) => renderNode(node, index))}
    </div>
  )
}

/**
 * Extract plain text from Lexical content (for previews/excerpts)
 */
export function extractPlainText(content: LexicalContent | null | undefined): string {
  if (!content?.root?.children) return ''

  let text = ''

  function traverse(nodes: LexicalNode[]) {
    for (const node of nodes) {
      if (node.type === 'text' && node.text) {
        text += node.text
      }
      if (node.children) {
        traverse(node.children)
      }
      // Add space after paragraphs and headings
      if (node.type === 'paragraph' || node.type === 'heading') {
        text += ' '
      }
    }
  }

  traverse(content.root.children)
  return text.trim()
}
