'use client'

import { useState, useEffect } from 'react'
import AdminDevPanel from '../components/AdminDevPanel'

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  
  useEffect(() => {
    document.title = 'Landing Pages Collection'
  }, [])

  const landingPages = [
    {
      id: 'maps-booster-deluxe',
      title: 'Maps Booster Deluxe',
      subtitle: 'Google Business Profile Optimization Service',
      description: 'Professional Google Maps optimization service designed for local service contractors. $500/month service to dominate local search results.',
      href: '/maps-booster-deluxe',
      category: 'Local SEO Service',
      color: 'from-blue-600 to-blue-800',
      emoji: '📍'
    },
    {
      id: 'tregnar',
      title: 'Tregnar',
      subtitle: 'SaaS Platform for Website Portfolio Management',
      description: 'Complete SaaS platform for managing websites in bulk. WordPress management, local market research, Reddit scraping, and more.',
      href: '/tregnar',
      category: 'SaaS Platform',
      color: 'from-indigo-600 to-purple-600',
      emoji: '🌐'
    },
    {
      id: 'ranktracker',
      title: 'MoonTracker',
      subtitle: 'Advanced SEO Rank Tracking Software',
      description: 'Comprehensive SEO rank tracking tool for agencies and professionals. Real-time tracking, competitor analysis, and white-label reporting.',
      href: '/ranktracker',
      category: 'SEO Software',
      color: 'from-purple-600 to-indigo-600',
      emoji: '🌙'
    }
  ]

  const filteredPages = landingPages.filter(page =>
    page.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.subtitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
    page.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">230landers</h1>
              <p className="text-gray-600 mt-1">Landing Pages Collection</p>
            </div>
            <div className="text-sm text-gray-500">
              Next.js + React + Tailwind
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        {/* Search */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <input
              type="text"
              placeholder="Search landing pages..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <svg className="absolute right-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-3xl font-bold text-blue-600">{landingPages.length}</div>
            <div className="text-gray-600">Landing Pages</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-3xl font-bold text-green-600">3</div>
            <div className="text-gray-600">Checkout Systems</div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="text-3xl font-bold text-purple-600">6</div>
            <div className="text-gray-600">API Endpoints</div>
          </div>
        </div>

        {/* Landing Pages Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-1">
          {filteredPages.map((page) => (
            <div key={page.id} className="bg-white rounded-2xl shadow-lg border hover:shadow-xl transition-shadow overflow-hidden">
              <div className={`bg-gradient-to-r ${page.color} p-6 text-white`}>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-3xl">{page.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-bold">{page.title}</h2>
                    <p className="text-blue-100">{page.subtitle}</p>
                  </div>
                </div>
                <div className="inline-block bg-white/20 px-3 py-1 rounded-full text-sm font-medium">
                  {page.category}
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-6 leading-relaxed">{page.description}</p>
                
                <div className="flex items-center justify-between">
                  <a
                    href={page.href}
                    className="inline-flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors font-semibold"
                  >
                    View Landing Page
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                  
                  <div className="text-sm text-gray-500">
                    /{page.id}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPages.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 text-xl mb-2">No pages found</div>
            <p className="text-gray-500">Try adjusting your search terms</p>
          </div>
        )}

        {/* Technical Info */}
        <div className="mt-16 bg-white rounded-xl shadow-sm border p-8">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Technical Overview</h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Technology Stack</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Next.js 14 with App Router</li>
                <li>• React 18 with TypeScript</li>
                <li>• Tailwind CSS for styling</li>
                <li>• Vercel for deployment</li>
                <li>• API Routes for backend logic</li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Features</h4>
              <ul className="space-y-2 text-gray-600">
                <li>• Multi-step checkout forms</li>
                <li>• Responsive design</li>
                <li>• Admin dev mode panel</li>
                <li>• Form validation & error handling</li>
                <li>• API integration ready</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Built for Lead Train • Converted from PHP to Next.js/React
              </div>
              <div className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                Ready for Vercel deployment
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Admin Dev Panel */}
      <AdminDevPanel 
        pageName="230landers Home"
        devActions={[
          {
            label: 'Visit Maps Booster Deluxe',
            action: () => window.location.href = '/maps-booster-deluxe',
            variant: 'primary'
          },
          {
            label: 'Visit Tregnar',
            action: () => window.location.href = '/tregnar',
            variant: 'primary'
          },
          {
            label: 'Visit Ranktracker',
            action: () => window.location.href = '/ranktracker',
            variant: 'primary'
          },
          {
            label: 'Test All API Endpoints',
            action: async () => {
              const endpoints = [
                '/api/process-payment',
                '/api/maps-booster/checkout', 
                '/api/tregnar/signup',
                '/api/admin/auth'
              ]
              
              console.log('🧪 Testing API endpoints...')
              
              for (const endpoint of endpoints) {
                try {
                  const response = await fetch(endpoint, { method: 'GET' })
                  console.log(`✅ ${endpoint}: ${response.status}`)
                } catch (error) {
                  console.log(`❌ ${endpoint}: Error`)
                }
              }
            },
            variant: 'warning'
          }
        ]}
      />
    </div>
  )
}
