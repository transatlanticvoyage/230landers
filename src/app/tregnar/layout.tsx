import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Tregnar Website Manager',
  description: 'Complete SaaS platform for managing websites in bulk. WordPress management, local market research, Reddit scraping, and more.'
}

export default function TregnarLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}