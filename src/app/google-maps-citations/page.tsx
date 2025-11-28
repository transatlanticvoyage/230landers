'use client'

import { useState, useEffect } from 'react'
import AdminDevPanel from '../../components/AdminDevPanel'

export default function GoogleMapsCitationsPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState('starter')
  
  useEffect(() => {
    document.title = 'Google Maps Citations - Lead Train'
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleCheckoutClick = (packageType: string) => {
    setSelectedPackage(packageType)
    setIsCheckoutOpen(true)
  }

  const packages = [
    {
      id: 'starter',
      name: 'Starter Pack',
      price: 50,
      citations: 25,
      features: [
        '25 High-Quality Citations',
        'Google Business Profile Focus', 
        'Local Directory Submissions',
        'NAP Consistency Check',
        'Basic Reporting',
        '2-Week Delivery'
      ]
    },
    {
      id: 'professional',
      name: 'Professional Pack',
      price: 97,
      citations: 50,
      popular: true,
      features: [
        '50 Premium Citations',
        'Google My Business Optimization',
        'Industry-Specific Directories',
        'Citation Cleanup & Audit',
        'Advanced Reporting',
        'Review Profile Setup',
        '10-Day Delivery'
      ]
    },
    {
      id: 'enterprise',
      name: 'Enterprise Pack', 
      price: 195,
      citations: 100,
      features: [
        '100 Premium Citations',
        'Complete GBP Enhancement',
        'Tier-1 Directory Network',
        'Competitor Citation Analysis',
        'Monthly Citation Monitoring',
        'Local SEO Audit Included',
        'Priority 5-Day Delivery'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white sticky top-0 z-50 shadow-lg">
        <nav className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <div className="text-2xl font-bold">
                Google Maps Citations{' '}
                <span className="bg-blue-400 text-gray-800 px-3 py-1 rounded-md text-xl ml-2">
                  by Lead Train
                </span>
              </div>
            </div>
            <ul className="hidden md:flex gap-8 items-center">
              <li><button onClick={() => scrollToSection('features')} className="text-white hover:opacity-80 transition-opacity">Features</button></li>
              <li><button onClick={() => scrollToSection('packages')} className="text-white hover:opacity-80 transition-opacity">Packages</button></li>
              <li><button onClick={() => scrollToSection('process')} className="text-white hover:opacity-80 transition-opacity">Process</button></li>
              <li><a href="#contact" className="text-white hover:opacity-80 transition-opacity">Contact</a></li>
            </ul>
            <div className="flex gap-4 items-center">
              <a href="/" className="px-5 py-2 bg-transparent border-2 border-white/30 rounded-lg text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all">
                Back to Home
              </a>
              <button 
                onClick={() => handleCheckoutClick('professional')}
                className="px-6 py-3 bg-blue-400 border-none rounded-lg text-gray-800 font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-400/40 uppercase tracking-wider text-sm"
              >
                Get Started
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
              Boost Your Google Business Profile with Citations
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto">
              Professional citation building service specifically designed for Google Business Profiles. 
              High-quality backlinks and brand signals that directly reference your GBP to improve local search rankings.
            </p>
            
            <div className="flex justify-center flex-wrap gap-10 my-10">
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">🎯</span>
                GBP-Focused Citations
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">🔗</span>
                High-Quality Backlinks
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">📈</span>
                Local SEO Boost
              </div>
            </div>
            
            <div className="flex justify-center gap-5 mt-10 flex-wrap">
              <button 
                onClick={() => handleCheckoutClick('professional')}
                className="px-9 py-5 bg-gradient-to-br from-blue-800 to-blue-600 text-white border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-600/30"
              >
                Get Citations Now
              </button>
              <a href="#packages" className="px-9 py-5 bg-white text-blue-600 border-2 border-slate-200 rounded-xl text-lg font-bold hover:border-blue-600 hover:transform hover:-translate-y-1 transition-all">
                View Packages
              </a>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Why Google Maps Citations Matter</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">Citations are one of the most important ranking factors for local SEO and Google Business Profile optimization.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: '📍',
                  title: 'Local Search Rankings',
                  description: 'Citations directly impact your Google My Business rankings in local search results and Google Maps pack.'
                },
                {
                  icon: '🔗',
                  title: 'Authority Building', 
                  description: 'Each citation acts as a vote of confidence for your business, building domain authority and trust signals.'
                },
                {
                  icon: '📊',
                  title: 'NAP Consistency',
                  description: 'Consistent Name, Address, Phone across the web reinforces your business legitimacy to Google.'
                },
                {
                  icon: '🌐',
                  title: 'Brand Visibility',
                  description: 'Get your business listed on high-traffic directories and platforms where customers are searching.'
                },
                {
                  icon: '⭐',
                  title: 'Review Opportunities',
                  description: 'Many citation sources allow customer reviews, providing additional reputation management opportunities.'
                },
                {
                  icon: '📈',
                  title: 'Competitive Edge',
                  description: 'Outrank competitors with a stronger citation profile and more comprehensive online presence.'
                }
              ].map((feature) => (
                <div key={feature.title} className="bg-white p-10 rounded-3xl shadow-lg text-left border border-slate-100 hover:transform hover:-translate-y-2 transition-all hover:shadow-xl">
                  <div className="w-15 h-15 bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-5 text-white">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="bg-gradient-to-br from-slate-50 to-slate-200 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Citation Packages</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">Choose the perfect citation package for your business needs and budget.</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {packages.map((pkg) => (
                <div key={pkg.id} className={`bg-white rounded-3xl p-8 text-center relative transition-all hover:transform hover:-translate-y-2 hover:shadow-xl ${pkg.popular ? 'transform scale-105 shadow-2xl border-4 border-blue-500' : 'shadow-lg'}`}>
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-3 text-slate-800">{pkg.name}</h3>
                  <div className="text-5xl font-extrabold text-blue-600 mb-2">${pkg.price}</div>
                  <div className="text-slate-500 text-lg mb-2">one-time</div>
                  <div className="text-2xl font-bold text-blue-500 mb-6">{pkg.citations} Citations</div>
                  
                  <ul className="list-none mb-8 space-y-3 text-left">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="py-2 text-slate-600 border-b border-slate-100 last:border-b-0 flex items-center gap-3">
                        <span className="text-green-500 font-bold">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => handleCheckoutClick(pkg.id)}
                    className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-500/30"
                  >
                    Order {pkg.name}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Citation Building Process</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">Professional, systematic approach to building high-quality citations for your Google Business Profile.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Business Audit',
                  description: 'We analyze your current citation profile and identify opportunities for improvement.'
                },
                {
                  step: '02',
                  title: 'Directory Research',
                  description: 'Find the most relevant, high-authority directories in your industry and location.'
                },
                {
                  step: '03',
                  title: 'Citation Building',
                  description: 'Create consistent, accurate citations across selected directories and platforms.'
                },
                {
                  step: '04',
                  title: 'Quality Check & Report',
                  description: 'Verify all citations are live and provide a comprehensive completion report.'
                }
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl mb-6 mx-auto">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{step.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-20 text-center">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-4xl font-bold mb-5">Ready to Boost Your Local Rankings?</h2>
            <p className="text-xl mb-10 opacity-90">Start building authority for your Google Business Profile with professional citations.</p>
            <div className="flex justify-center gap-5 flex-wrap">
              <button 
                onClick={() => handleCheckoutClick('professional')}
                className="px-9 py-5 bg-blue-400 text-gray-800 border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-400/40"
              >
                Get Started Today
              </button>
              <a href="#contact" className="px-9 py-5 bg-transparent text-white border-2 border-white/30 rounded-xl text-lg font-bold hover:bg-white/10 hover:border-white/50 transition-all">
                Contact Us
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-slate-800 text-white py-15">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2 max-w-sm">
              <div className="text-2xl font-bold text-white mb-4">
                Google Maps Citations
              </div>
              <p className="text-slate-400 leading-relaxed">
                Professional citation building services to boost your Google Business Profile rankings and local search visibility.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Services</h4>
              <ul className="list-none space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Citation Building</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">GBP Optimization</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Local SEO Audit</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">NAP Cleanup</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Support</h4>
              <ul className="list-none space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">FAQ</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Delivery Times</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Guarantee</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-5 text-slate-400">
            <div>© 2025 Lead Train. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Checkout Modal - Placeholder */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Order {packages.find(p => p.id === selectedPackage)?.name}</h3>
              <p className="text-gray-600 mb-6">
                You selected the {packages.find(p => p.id === selectedPackage)?.name} package 
                (${packages.find(p => p.id === selectedPackage)?.price}) with {packages.find(p => p.id === selectedPackage)?.citations} citations.
              </p>
              <p className="text-gray-600 mb-6">
                Checkout functionality will be integrated with your existing payment system.
              </p>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dev Panel */}
      <AdminDevPanel 
        pageName="Google Maps Citations"
        devActions={[
          {
            label: 'Test Starter Package',
            action: () => handleCheckoutClick('starter'),
            variant: 'success'
          },
          {
            label: 'Test Professional Package',
            action: () => handleCheckoutClick('professional'),
            variant: 'primary'
          },
          {
            label: 'Test Enterprise Package',
            action: () => handleCheckoutClick('enterprise'),
            variant: 'warning'
          }
        ]}
      />
    </div>
  )
}