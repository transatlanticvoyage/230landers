import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Maps Booster Deluxe',
  description: 'Professional Google Business Profile optimization service designed specifically for local service contractors who want to rank #1 in Google Maps'
}

export default function MapsBoosterDeluxeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}