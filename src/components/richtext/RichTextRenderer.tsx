'use client'

import { RichText } from '@payloadcms/richtext-lexical/react'
import type { SerializedEditorState } from '@payloadcms/richtext-lexical/lexical'
import { cn } from '@/lib/utils'

/**
 * Payload CMS rich text field structure
 */
interface PayloadRichTextField {
  root: {
    type: string
    children: unknown[]
    direction?: ('ltr' | 'rtl') | null
    format?: string
    indent?: number
    version?: number
  }
  [k: string]: unknown
}

interface RichTextRendererProps {
  content: PayloadRichTextField | null | undefined
  className?: string
}

/**
 * Render Lexical rich text content from Payload CMS
 * Uses Payload's built-in RichText component with custom styling
 */
export function RichTextRenderer({ content, className }: Readonly<RichTextRendererProps>) {
  if (!content?.root?.children?.length) {
    return null
  }

  return (
    <RichText
      data={content as SerializedEditorState}
      className={cn('rich-text-content', className)}
    />
  )
}

/**
 * Lexical content structure for type checking
 */
interface LexicalNode {
  type: string
  text?: string
  children?: LexicalNode[]
}

interface LexicalContent {
  root: {
    children: LexicalNode[]
  }
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
