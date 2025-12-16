'use client'

import { useState, useEffect } from 'react'
import AdminDevPanel from '../../components/AdminDevPanel'

export default function LocalLinkjetPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedPackage, setSelectedPackage] = useState('starter')
  
  useEffect(() => {
    document.title = 'Local LinkJet - Boutique Backlinking Service for Local Businesses'
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleOrderClick = (packageType: string) => {
    setSelectedPackage(packageType)
    setIsCheckoutOpen(true)
  }

  const packages = [
    {
      id: 'starter',
      name: 'Starter Boost',
      price: '$497',
      monthly: false,
      features: [
        '25 High-Quality Local Citations',
        '10 Guest Posts on Local Blogs',
        '5 Niche-Relevant Directory Submissions',
        'NAP Consistency Audit & Fix',
        'Google Business Profile Optimization',
        '30-Day Ranking Report'
      ],
      best: false,
      description: 'Perfect for new local businesses looking to establish their online presence'
    },
    {
      id: 'growth',
      name: 'Growth Engine',
      price: '$997',
      monthly: false,
      features: [
        '50 High-Quality Local Citations',
        '25 Guest Posts on Authority Sites',
        '15 Niche-Relevant Directory Submissions',
        '10 Press Release Distributions',
        'Competitor Backlink Analysis',
        'Monthly Ranking Reports',
        'Schema Markup Implementation'
      ],
      best: true,
      description: 'Ideal for established businesses ready to dominate their local market'
    },
    {
      id: 'dominator',
      name: 'Market Dominator',
      price: '$1,997',
      monthly: true,
      recurring: '$497/mo',
      features: [
        '100+ High-Quality Local Citations',
        '50 Guest Posts on High-DA Sites',
        '30 Niche Directory Submissions',
        '20 Press Release Distributions',
        'Complete Link Audit & Disavow',
        'Weekly Ranking Reports',
        'Dedicated Account Manager',
        'Ongoing Link Building (10/month)'
      ],
      best: false,
      description: 'For businesses serious about owning their local search results'
    }
  ]

  const results = [
    {
      business: 'Denver Plumbing Pros',
      industry: 'Home Services',
      before: '#12 in local pack',
      after: '#1 in local pack',
      timeframe: '45 days',
      revenue: '+$32,000/month'
    },
    {
      business: 'Austin Family Dental',
      industry: 'Healthcare',
      before: 'Page 2 for "dentist near me"',
      after: '#2 organic result',
      timeframe: '60 days',
      revenue: '+18 new patients/month'
    },
    {
      business: 'Chicago Auto Repair',
      industry: 'Automotive',
      before: 'No local visibility',
      after: '#1 for 5 keywords',
      timeframe: '30 days',
      revenue: '+$45,000/month'
    }
  ]

  const linkTypes = [
    {
      icon: '📍',
      title: 'Local Citations',
      description: 'Consistent NAP listings across top local directories and data aggregators'
    },
    {
      icon: '✍️',
      title: 'Guest Posts',
      description: 'High-quality content on relevant local and industry blogs with contextual links'
    },
    {
      icon: '📰',
      title: 'Press Releases',
      description: 'News distribution to local media outlets and news aggregators'
    },
    {
      icon: '🏢',
      title: 'Business Directories',
      description: 'Premium listings in niche-specific and local business directories'
    },
    {
      icon: '🤝',
      title: 'Local Partnerships',
      description: 'Strategic link exchanges with complementary local businesses'
    },
    {
      icon: '⭐',
      title: 'Review Platforms',
      description: 'Optimized profiles on major review sites with proper linking structure'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-900 to-purple-700 text-white sticky top-0 z-50 shadow-lg">
        <nav className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <div className="text-2xl font-bold">
                Local LinkJet{' '}
                <span className="bg-purple-400 text-gray-800 px-3 py-1 rounded-md text-xl ml-2">
                  by Lead Train
                </span>
              </div>
            </div>
            <ul className="hidden md:flex gap-8 items-center">
              <li><button onClick={() => scrollToSection('how-it-works')} className="text-white hover:opacity-80 transition-opacity">How It Works</button></li>
              <li><button onClick={() => scrollToSection('packages')} className="text-white hover:opacity-80 transition-opacity">Packages</button></li>
              <li><button onClick={() => scrollToSection('results')} className="text-white hover:opacity-80 transition-opacity">Results</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="text-white hover:opacity-80 transition-opacity">FAQ</button></li>
            </ul>
            <div className="flex gap-4 items-center">
              <button 
                onClick={() => handleOrderClick('growth')}
                className="px-6 py-3 bg-purple-400 border-none rounded-lg text-gray-800 font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-purple-400/40 uppercase tracking-wider text-sm"
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
            <div className="bg-green-600 text-white px-6 py-2 rounded-full inline-block mb-6 font-bold animate-pulse">
              ⚡ LIMITED SPOTS: Only 10 Clients Per Month
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-5 leading-tight">
              Rank Your Local Business #1 in Google<br/>
              With Boutique Backlinking That Actually Works
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto">
              Local LinkJet is a premium, done-for-you backlinking service that helps local businesses 
              dominate their competition with high-quality, relevant links that Google loves.
            </p>
            
            <div className="flex justify-center flex-wrap gap-10 my-10">
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">✅</span>
                100% White-Hat Methods
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">📈</span>
                Guaranteed Results in 30-60 Days
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">🏆</span>
                500+ Businesses Ranked #1
              </div>
            </div>
            
            <div className="flex justify-center gap-5 mt-10 flex-wrap">
              <button 
                onClick={() => handleOrderClick('growth')}
                className="px-9 py-5 bg-gradient-to-br from-purple-900 to-purple-700 text-white border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-purple-700/30"
              >
                View Packages & Pricing
              </button>
              <button onClick={() => scrollToSection('results')} className="px-9 py-5 bg-white text-purple-700 border-2 border-slate-200 rounded-xl text-lg font-bold hover:border-purple-700 hover:transform hover:-translate-y-1 transition-all">
                See Client Results
              </button>
            </div>

            <div className="mt-8 text-sm text-slate-600">
              🔒 No Contracts • 🎯 Results Guaranteed • 💯 Google-Safe Methods
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Why 90% of Local Businesses Fail at Link Building
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Most local businesses either ignore backlinks entirely or buy cheap, spammy links that hurt more than help.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-12 items-start">
              <div className="bg-red-50 p-8 rounded-2xl border-2 border-red-200">
                <h3 className="text-2xl font-bold text-red-800 mb-6">
                  ❌ What Doesn't Work
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">×</span>
                    <div>
                      <strong className="text-slate-800">Cheap Fiverr Links:</strong>
                      <p className="text-slate-600 mt-1">Thousands of low-quality links from irrelevant sites that Google ignores or penalizes</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">×</span>
                    <div>
                      <strong className="text-slate-800">PBN Networks:</strong>
                      <p className="text-slate-600 mt-1">Private blog networks that get deindexed and destroy your rankings overnight</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">×</span>
                    <div>
                      <strong className="text-slate-800">Automated Submissions:</strong>
                      <p className="text-slate-600 mt-1">Bot-generated directory submissions that provide zero value</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-red-500 text-xl mt-1">×</span>
                    <div>
                      <strong className="text-slate-800">Random Guest Posts:</strong>
                      <p className="text-slate-600 mt-1">Articles on unrelated sites that don't help local rankings</p>
                    </div>
                  </li>
                </ul>
              </div>
              
              <div className="bg-green-50 p-8 rounded-2xl border-2 border-green-200">
                <h3 className="text-2xl font-bold text-green-800 mb-6">
                  ✅ The LinkJet Method
                </h3>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <div>
                      <strong className="text-slate-800">Local Relevance First:</strong>
                      <p className="text-slate-600 mt-1">Every link comes from sites in your city or industry, maximizing local SEO impact</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <div>
                      <strong className="text-slate-800">Quality Over Quantity:</strong>
                      <p className="text-slate-600 mt-1">10 high-quality links beat 1,000 spam links every time</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <div>
                      <strong className="text-slate-800">Natural Link Velocity:</strong>
                      <p className="text-slate-600 mt-1">Links built gradually to match Google's expectations</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 text-xl mt-1">✓</span>
                    <div>
                      <strong className="text-slate-800">Diverse Link Profile:</strong>
                      <p className="text-slate-600 mt-1">Mix of citations, guest posts, and editorial links for maximum authority</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="bg-gradient-to-br from-purple-50 to-purple-100 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Proven Link Building Process</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                We handle everything from audit to execution, so you can focus on running your business.
              </p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8">
              {[
                {
                  step: '1',
                  title: 'Audit & Analysis',
                  description: 'We analyze your current backlink profile, competitor links, and identify the best opportunities for growth.'
                },
                {
                  step: '2',
                  title: 'Strategy Creation',
                  description: 'Custom link building strategy based on your industry, location, and competition level.'
                },
                {
                  step: '3',
                  title: 'Outreach & Creation',
                  description: 'Our team reaches out to relevant sites, creates content, and secures high-quality backlinks.'
                },
                {
                  step: '4',
                  title: 'Monitor & Report',
                  description: 'Track rankings, monitor new links, and receive detailed monthly reports on your progress.'
                }
              ].map((item, idx) => (
                <div key={idx} className="text-center">
                  <div className="w-20 h-20 bg-purple-700 rounded-full flex items-center justify-center text-white font-bold text-2xl mx-auto mb-4">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{item.title}</h3>
                  <p className="text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Link Types Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                Types of Links We Build
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                A diverse, natural link profile that Google rewards with higher rankings.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6">
              {linkTypes.map((type, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">{type.icon}</div>
                  <h3 className="text-xl font-bold text-slate-800 mb-3">{type.title}</h3>
                  <p className="text-slate-600">{type.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Packages Section */}
        <section id="packages" className="bg-gradient-to-br from-slate-50 to-slate-200 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Choose Your Growth Package</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Transparent pricing, no hidden fees, cancel anytime.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <div key={pkg.id} className={`bg-white rounded-2xl shadow-lg p-8 relative ${pkg.best ? 'ring-4 ring-purple-500 transform scale-105' : ''}`}>
                  {pkg.best && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-purple-700 text-white px-4 py-1 rounded-full text-sm font-bold">
                      MOST POPULAR
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">{pkg.name}</h3>
                    <div className="text-4xl font-bold text-purple-700 mb-1">{pkg.price}</div>
                    {pkg.monthly && (
                      <div className="text-sm text-slate-600">
                        then {pkg.recurring} ongoing
                      </div>
                    )}
                    <p className="text-sm text-slate-600 mt-3">{pkg.description}</p>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1">✓</span>
                        <span className="text-slate-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button 
                    onClick={() => handleOrderClick(pkg.id)}
                    className={`w-full py-3 rounded-lg font-bold transition-all ${
                      pkg.best 
                        ? 'bg-purple-700 text-white hover:bg-purple-800' 
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    Get Started
                  </button>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <p className="text-slate-600">
                🔒 Secure checkout • 💳 All major cards accepted • 📧 Instant confirmation
              </p>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section id="results" className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Real Results for Real Businesses</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                These local businesses trusted us with their SEO. Here's what happened.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {results.map((result, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg">
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-800">{result.business}</h3>
                    <p className="text-purple-600 font-semibold">{result.industry}</p>
                  </div>
                  
                  <div className="space-y-4 mb-6">
                    <div>
                      <div className="text-sm text-slate-500 mb-1">Before:</div>
                      <div className="text-red-600 font-semibold">{result.before}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500 mb-1">After:</div>
                      <div className="text-green-600 font-semibold text-lg">{result.after}</div>
                    </div>
                  </div>
                  
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-600">⏱ {result.timeframe}</span>
                      <span className="text-green-600 font-bold">{result.revenue}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <div className="bg-purple-50 inline-block px-8 py-4 rounded-xl">
                <p className="text-lg font-semibold text-purple-800">
                  Average client sees 287% increase in organic traffic within 90 days
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Guarantee Section */}
        <section className="bg-gradient-to-br from-green-50 to-green-100 py-20">
          <div className="max-w-4xl mx-auto px-5 text-center">
            <div className="text-6xl mb-6">🛡️</div>
            <h2 className="text-4xl font-bold text-slate-800 mb-6">
              Our Iron-Clad Guarantee
            </h2>
            <div className="bg-white p-8 rounded-2xl shadow-lg">
              <p className="text-xl text-slate-700 mb-6">
                If you don't see measurable improvement in your rankings within 60 days, 
                we'll work for FREE until you do. No questions asked.
              </p>
              <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="border-l-4 border-green-500 pl-4">
                  <strong className="text-slate-800">100% Safe</strong>
                  <p className="text-slate-600 mt-1">White-hat methods only, zero risk of penalties</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <strong className="text-slate-800">Results Guaranteed</strong>
                  <p className="text-slate-600 mt-1">Ranking improvement or your money back</p>
                </div>
                <div className="border-l-4 border-green-500 pl-4">
                  <strong className="text-slate-800">No Contracts</strong>
                  <p className="text-slate-600 mt-1">Month-to-month service, cancel anytime</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="py-20">
          <div className="max-w-4xl mx-auto px-5">
            <h2 className="text-4xl font-bold text-slate-800 mb-12 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              {[
                {
                  q: "How long before I see results?",
                  a: "Most clients see initial movement in rankings within 2-3 weeks, with significant improvements by day 30-45. Full results typically manifest within 60-90 days, depending on competition."
                },
                {
                  q: "Are your methods safe and Google-compliant?",
                  a: "Absolutely. We only use white-hat, Google-approved link building methods. Every link is earned through legitimate outreach, quality content, and real relationships. We never use PBNs, link farms, or any black-hat tactics."
                },
                {
                  q: "What makes you different from other link building services?",
                  a: "We focus exclusively on local businesses and understand the unique challenges of local SEO. Our links are locally relevant, our team manually vets every opportunity, and we limit our client roster to ensure quality service."
                },
                {
                  q: "Can I see examples of links you'll build?",
                  a: "Yes! During our initial consultation, we'll show you examples of actual links we've built for similar businesses in your industry. You'll also receive a detailed report of every link we build for you."
                },
                {
                  q: "What if I'm not happy with the results?",
                  a: "We offer a 60-day performance guarantee. If you don't see measurable ranking improvements, we'll continue working for free until you do. You can also cancel anytime with no penalties."
                },
                {
                  q: "Do you work with all types of local businesses?",
                  a: "We work with most local service businesses including home services, medical practices, law firms, restaurants, auto services, and more. We don't work with gambling, adult, or pharmaceutical sites."
                }
              ].map((faq, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-md">
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{faq.q}</h3>
                  <p className="text-slate-600">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Final CTA Section */}
        <section className="bg-gradient-to-br from-purple-900 to-purple-700 text-white py-20 text-center">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-4xl font-bold mb-5">
              Ready to Dominate Your Local Market?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join 500+ local businesses that rank #1 in their cities with LinkJet.
            </p>
            
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 max-w-2xl mx-auto mb-10">
              <div className="text-3xl font-bold mb-4">
                Limited Availability: <span className="text-yellow-400">Only 3 Spots Left This Month</span>
              </div>
              <p className="text-lg mb-8">
                We limit our monthly clients to maintain quality. Don't miss your chance to work with the best.
              </p>
              
              <div className="flex flex-col md:flex-row gap-4 justify-center">
                <button 
                  onClick={() => handleOrderClick('growth')}
                  className="px-9 py-5 bg-purple-400 text-gray-800 border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-purple-400/40"
                >
                  Claim Your Spot Now
                </button>
                <button 
                  onClick={() => scrollToSection('packages')}
                  className="px-9 py-5 bg-transparent border-2 border-white/50 text-white rounded-xl text-lg font-bold hover:bg-white/10 transition-all"
                >
                  View Packages
                </button>
              </div>
              
              <div className="mt-6 text-sm opacity-90">
                ✓ No Setup Fees • ✓ Cancel Anytime • ✓ 60-Day Guarantee
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-800 text-white py-15">
        <div className="max-w-6xl mx-auto px-5">
          <div className="grid md:grid-cols-4 gap-10 mb-10">
            <div className="md:col-span-2 max-w-sm">
              <div className="text-2xl font-bold text-white mb-4">
                Local LinkJet
              </div>
              <p className="text-slate-400 leading-relaxed">
                Premium backlinking service for local businesses. 
                Rank higher, get more customers, dominate your market.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Services</h4>
              <ul className="list-none space-y-2">
                <li><a href="#packages" className="text-slate-400 hover:text-purple-400 transition-colors">Link Building Packages</a></li>
                <li><a href="#how-it-works" className="text-slate-400 hover:text-purple-400 transition-colors">Our Process</a></li>
                <li><a href="#results" className="text-slate-400 hover:text-purple-400 transition-colors">Case Studies</a></li>
                <li><a href="#faq" className="text-slate-400 hover:text-purple-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Company</h4>
              <ul className="list-none space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">About Us</a></li>
                <li><a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">Client Portal</a></li>
                <li><a href="#" className="text-slate-400 hover:text-purple-400 transition-colors">Guarantee</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-5 text-slate-400">
            <div>© 2025 Lead Train - Local LinkJet. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-purple-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-purple-400 transition-colors">Refund Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Order</h3>
              <div className="bg-purple-50 p-4 rounded-lg mb-6">
                <div className="text-lg font-semibold text-purple-800 mb-2">
                  {packages.find(p => p.id === selectedPackage)?.name} Package
                </div>
                <div className="text-3xl font-bold text-purple-700 mb-1">
                  {packages.find(p => p.id === selectedPackage)?.price}
                </div>
                {packages.find(p => p.id === selectedPackage)?.monthly && (
                  <div className="text-sm text-slate-600">
                    then {packages.find(p => p.id === selectedPackage)?.recurring} ongoing
                  </div>
                )}
              </div>
              <p className="text-gray-600 mb-6">
                You're about to transform your local search rankings with premium, 
                Google-safe backlinks that actually work.
              </p>
              <div className="space-y-3 mb-6">
                <div className="text-left border-l-4 border-green-500 pl-4">
                  <strong>✓ Start immediately</strong> after checkout
                </div>
                <div className="text-left border-l-4 border-green-500 pl-4">
                  <strong>✓ 60-day guarantee</strong> or work for free
                </div>
                <div className="text-left border-l-4 border-green-500 pl-4">
                  <strong>✓ Cancel anytime</strong> no questions asked
                </div>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="bg-purple-700 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition-colors w-full font-bold"
              >
                Proceed to Secure Checkout
              </button>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="mt-3 text-gray-500 hover:text-gray-700 text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Admin Dev Panel */}
      <AdminDevPanel 
        pageName="Local LinkJet"
        devActions={[
          {
            label: 'Test Checkout Modal',
            action: () => setIsCheckoutOpen(true),
            variant: 'primary'
          },
          {
            label: 'Scroll to Packages',
            action: () => scrollToSection('packages'),
            variant: 'success'
          },
          {
            label: 'Scroll to Results',
            action: () => scrollToSection('results'),
            variant: 'warning'
          },
          {
            label: 'Scroll to FAQ',
            action: () => scrollToSection('faq'),
            variant: 'primary'
          }
        ]}
      />
    </div>
  )
}