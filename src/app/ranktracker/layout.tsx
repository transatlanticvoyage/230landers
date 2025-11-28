import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Moon Ranker',
  description: 'Advanced SEO rank tracking software for agencies and professionals. Real-time tracking, competitor analysis, and white-label reporting.'
}

export default function RanktrackerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}