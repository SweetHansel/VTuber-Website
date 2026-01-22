import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'VTuber Portfolio',
  description: 'VTuber portfolio website with Live2D models, music, and artworks',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return children
}
