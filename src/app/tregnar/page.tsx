'use client'

import { useState } from 'react'
import AdminDevPanel from '../../components/AdminDevPanel'

export default function TregnarPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCheckoutClick = (e: React.MouseEvent) => {
    e.preventDefault()
    setIsCheckoutOpen(true)
  }

  const handleTregnarSignup = async (plan: string = 'professional') => {
    try {
      const response = await fetch('/api/tregnar/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          plan,
          account: {
            email: 'demo@example.com',
            firstName: 'Demo',
            lastName: 'User',
            company: 'Demo Company'
          },
          timestamp: new Date().toISOString()
        })
      })

      const data = await response.json()

      if (data.success) {
        console.log('Tregnar signup successful:', data.account)
        alert('Tregnar account created successfully! Check console for details.')
      } else {
        alert('Signup failed: ' + data.message)
      }
    } catch (error) {
      console.error('Tregnar signup error:', error)
      alert('Network error during signup')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white sticky top-0 z-50 shadow-lg">
        <nav className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="text-3xl font-extrabold bg-gradient-to-br from-yellow-400 to-yellow-500 bg-clip-text text-transparent">
              Tregnar
            </div>
            <ul className="hidden md:flex gap-8 items-center">
              <li><button onClick={() => scrollToSection('features')} className="hover:opacity-80 transition-opacity">Features</button></li>
              <li><a href="#pricing" className="hover:opacity-80 transition-opacity">Pricing</a></li>
              <li><button onClick={() => scrollToSection('business-models')} className="hover:opacity-80 transition-opacity">Use Cases</button></li>
              <li><a href="#about" className="hover:opacity-80 transition-opacity">About</a></li>
              <li><a href="#contact" className="hover:opacity-80 transition-opacity">Contact</a></li>
            </ul>
            <div className="flex gap-4 items-center">
              <a href="#" className="px-5 py-2 bg-transparent border-2 border-white/30 rounded-lg text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all">
                Log In
              </a>
              <button 
                onClick={() => handleTregnarSignup('professional')}
                className="px-6 py-3 bg-gradient-to-br from-yellow-400 to-yellow-500 border-none rounded-lg text-gray-800 font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-yellow-400/40 uppercase tracking-wider text-sm"
              >
                Start Free Trial
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 to-slate-200 py-25">
          <div className="max-w-6xl mx-auto px-5 text-center py-20">
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-5 leading-tight">
              Scale Your Website Portfolio with Tregnar
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto">
              The complete SaaS platform for managing websites in bulk. Build, launch, and optimize lead generation sites, 
              rank and rent properties, affiliate networks, e-commerce stores, and client SEO projects—all from one powerful dashboard.
            </p>
            
            <div className="flex justify-center flex-wrap gap-10 my-10">
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">⚙️</span>
                WordPress-centric bulk management
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">📊</span>
                Local market research & analytics
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">🔍</span>
                Reddit scraper & keyword tools
              </div>
            </div>
            
            <div className="flex justify-center gap-5 mt-10 flex-wrap">
              <button 
                onClick={() => handleTregnarSignup('professional')}
                className="px-9 py-5 bg-gradient-to-br from-indigo-600 to-purple-600 text-white border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-indigo-600/30"
              >
                Start Free Trial
              </button>
              <a href="#" className="px-9 py-5 bg-white text-indigo-600 border-2 border-slate-200 rounded-xl text-lg font-bold hover:border-indigo-600 hover:transform hover:-translate-y-1 transition-all">
                Watch Demo
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Everything you need to scale your web business</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">From local lead generation to enterprise-level affiliate networks, Tregnar provides the tools to manage it all.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: '🌐',
                  title: 'Bulk WordPress Management',
                  description: 'Deploy, update, and maintain hundreds of WordPress sites from a single dashboard. Automated backups, security monitoring, and performance optimization included.'
                },
                {
                  icon: '📍',
                  title: 'Local Market Research',
                  description: 'Access comprehensive data on local lead generation opportunities across English-speaking markets. Perfect for rank and rent strategies.'
                },
                {
                  icon: '🔍',
                  title: 'Reddit Content Mining',
                  description: 'Advanced Reddit scraper to discover trending content, filter mass URLs, and identify high-converting affiliate opportunities.'
                },
                {
                  icon: '🌍',
                  title: 'Domain & Hosting Control',
                  description: 'Manage domain names, hosting accounts, billing plans, and nameservers. Automatic IP fetching and metrics tracking for all your properties.'
                },
                {
                  icon: '🔗',
                  title: 'PBN Link Analysis',
                  description: 'Homepage link scraper reveals interconnected linking patterns between your sites. Optimize your private blog network structure.'
                },
                {
                  icon: '📈',
                  title: 'Keyword Research & Ranking',
                  description: 'Built-in keyword research tools and rank tracking. Monitor your positions across all sites and discover new opportunities.'
                }
              ].map((feature) => (
                <div key={feature.title} className="bg-white p-10 rounded-3xl shadow-lg text-left border border-slate-100 hover:transform hover:-translate-y-2 transition-all hover:shadow-xl">
                  <div className="w-15 h-15 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl flex items-center justify-center text-2xl mb-5 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Business Models Section */}
        <section id="business-models" className="bg-gradient-to-br from-slate-50 to-slate-200 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Perfect for Every Web Business Model</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">Whether you're running lead generation sites or managing client SEO campaigns, Tregnar scales with your business.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🏪',
                  title: 'Local Lead Generation',
                  description: 'Build and manage location-specific websites that capture leads for local businesses. Complete with market research and competitor analysis.',
                  features: ['Local SEO', 'Lead Capture', 'Market Analysis']
                },
                {
                  icon: '🏢',
                  title: 'Rank and Rent',
                  description: 'Scale your rank and rent operation with tools designed for building, ranking, and monetizing multiple local service websites.',
                  features: ['Site Building', 'Ranking Tools', 'Revenue Tracking']
                },
                {
                  icon: '💰',
                  title: 'Affiliate Marketing',
                  description: 'Create and manage affiliate websites at scale. Reddit content mining helps you discover trending products and niches.',
                  features: ['Content Mining', 'Trend Analysis', 'Conversion Tracking']
                },
                {
                  icon: '🛒',
                  title: 'E-commerce Networks',
                  description: 'Deploy and manage multiple e-commerce stores. Centralized inventory management and performance analytics across all stores.',
                  features: ['Store Management', 'Inventory Sync', 'Analytics']
                },
                {
                  icon: '👥',
                  title: 'Client SEO',
                  description: 'Manage client websites with professional reporting. White-label dashboard options and automated client communication tools.',
                  features: ['Client Portal', 'White Label', 'Reporting']
                },
                {
                  icon: '🕸️',
                  title: 'PBN Management',
                  description: 'Build and maintain private blog networks with advanced link analysis and footprint masking capabilities.',
                  features: ['Link Analysis', 'Footprint Masking', 'Network Health']
                }
              ].map((model) => (
                <div key={model.title} className="bg-white p-8 rounded-2xl shadow-md text-center border-2 border-slate-100 hover:border-indigo-600 hover:transform hover:-translate-y-1 transition-all">
                  <div className="text-5xl mb-5">{model.icon}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{model.title}</h3>
                  <p className="text-slate-600 mb-5 text-sm">{model.description}</p>
                  <ul className="list-none p-0">
                    {model.features.map((feature) => (
                      <li key={feature} className="py-1 text-slate-600 text-sm border-b border-slate-100 last:border-b-0">
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-indigo-600 to-purple-600 text-white py-20 text-center">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-4xl font-bold mb-5">Ready to scale your web business?</h2>
            <p className="text-xl mb-10 opacity-90">Join thousands of marketers who are already using Tregnar to manage their website portfolios more efficiently.</p>
            <div className="flex justify-center gap-5">
              <button 
                onClick={() => handleTregnarSignup('professional')}
                className="px-9 py-5 bg-gradient-to-br from-yellow-400 to-yellow-500 text-gray-800 border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-yellow-400/40"
              >
                Start Free Trial
              </button>
              <a href="#" className="px-9 py-5 bg-transparent text-white border-2 border-white/30 rounded-xl text-lg font-bold hover:bg-white/10 hover:border-white/50 transition-all">
                Schedule Demo
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-15">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-5 gap-10 mb-10">
            <div className="md:col-span-2 max-w-sm">
              <div className="text-2xl font-extrabold bg-gradient-to-br from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-4">
                Tregnar
              </div>
              <p className="text-slate-400 leading-relaxed">
                The complete SaaS platform for managing websites in bulk. Scale your web business with powerful tools designed for modern marketers.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Product</h4>
              <ul className="list-none space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Features</a></li>
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Pricing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Integrations</a></li>
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">API</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Use Cases</h4>
              <ul className="list-none space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Lead Generation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Rank and Rent</a></li>
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Affiliate Marketing</a></li>
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Client SEO</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Company</h4>
              <ul className="list-none space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">About</a></li>
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Careers</a></li>
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-yellow-400 transition-colors">Privacy</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-5 text-slate-400">
            <div>© 2025 Tregnar. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-yellow-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-yellow-400 transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Checkout Modal - Placeholder for now */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Coming Soon!</h3>
              <p className="text-gray-600 mb-6">
                Checkout functionality is being built with Next.js API routes. 
                This will include the full multi-step checkout process for Tregnar.
              </p>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dev Panel */}
      <AdminDevPanel 
        pageName="Tregnar SaaS"
        devActions={[
          {
            label: 'Test Starter Plan Signup',
            action: () => handleTregnarSignup('starter'),
            variant: 'success'
          },
          {
            label: 'Test Professional Plan Signup',
            action: () => handleTregnarSignup('professional'),
            variant: 'primary'
          },
          {
            label: 'Test Enterprise Plan Signup',
            action: () => handleTregnarSignup('enterprise'),
            variant: 'warning'
          },
          {
            label: 'Open Checkout Modal',
            action: () => {
              setIsCheckoutOpen(true)
            },
            variant: 'primary'
          }
        ]}
      />
    </div>
  )
}