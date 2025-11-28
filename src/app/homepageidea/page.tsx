'use client'

import { useState, useEffect } from 'react'
import AdminDevPanel from '../../components/AdminDevPanel'

export default function HomepageIdeaPage() {
  const [isContactOpen, setIsContactOpen] = useState(false)
  
  useEffect(() => {
    document.title = 'Lead Train - Home Services Lead Generation & Digital Marketing'
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleContactClick = () => {
    setIsContactOpen(true)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white sticky top-0 z-50 shadow-lg">
        <nav className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚆</span>
              <div className="text-2xl font-bold">
                Lead Train{' '}
                <span className="bg-blue-400 text-gray-800 px-3 py-1 rounded-md text-xl ml-2">
                  Digital Marketing
                </span>
              </div>
            </div>
            <ul className="hidden md:flex gap-8 items-center">
              <li><button onClick={() => scrollToSection('services')} className="text-white hover:opacity-80 transition-opacity">Services</button></li>
              <li><button onClick={() => scrollToSection('industries')} className="text-white hover:opacity-80 transition-opacity">Industries</button></li>
              <li><button onClick={() => scrollToSection('results')} className="text-white hover:opacity-80 transition-opacity">Results</button></li>
              <li><button onClick={() => scrollToSection('process')} className="text-white hover:opacity-80 transition-opacity">Process</button></li>
              <li><a href="#contact" className="text-white hover:opacity-80 transition-opacity">Contact</a></li>
            </ul>
            <div className="flex gap-4 items-center">
              <a href="tel:+1-555-LEADGEN" className="px-5 py-2 bg-transparent border-2 border-white/30 rounded-lg text-white font-semibold hover:bg-white/10 hover:border-white/50 transition-all">
                Call Us
              </a>
              <button 
                onClick={handleContactClick}
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
              Drive More Leads, Calls & Revenue for Your Home Services Business
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto">
              Lead Train specializes in SEO-driven lead generation for home services contractors. 
              We help pest control, HVAC, plumbing, roofing, and other service businesses dominate local search 
              and generate high-quality leads that convert into paying customers.
            </p>
            
            <div className="flex justify-center flex-wrap gap-10 my-10">
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">📞</span>
                More Phone Calls
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">🎯</span>
                Qualified Leads
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">💰</span>
                Higher Revenue
              </div>
            </div>
            
            <div className="flex justify-center gap-5 mt-10 flex-wrap">
              <button 
                onClick={handleContactClick}
                className="px-9 py-5 bg-gradient-to-br from-blue-800 to-blue-600 text-white border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-600/30"
              >
                Get More Leads Now
              </button>
              <a href="#results" className="px-9 py-5 bg-white text-blue-600 border-2 border-slate-200 rounded-xl text-lg font-bold hover:border-blue-600 hover:transform hover:-translate-y-1 transition-all">
                See Results
              </a>
            </div>
          </div>
        </section>

        {/* Services Section */}
        <section id="services" className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Digital Marketing Services</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">We use proven SEO and digital marketing strategies to help home services businesses grow.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: '🔍',
                  title: 'Local SEO Domination',
                  description: 'Get your business ranking #1 in Google Maps and local search results. We optimize your Google Business Profile and build local citations to dominate your service area.'
                },
                {
                  icon: '📱',
                  title: 'Lead Generation Websites',
                  description: 'Custom-built websites designed to convert visitors into customers. Optimized for mobile, fast loading, and built to rank in search engines.'
                },
                {
                  icon: '📞',
                  title: 'Pay-Per-Call Marketing',
                  description: 'Generate qualified phone calls from customers ready to buy. We create targeted campaigns that drive high-intent prospects to call your business.'
                },
                {
                  icon: '🎯',
                  title: 'Google Ads Management',
                  description: 'Strategic Google Ads campaigns that target customers searching for your services. Maximum ROI with optimized ad spend and landing pages.'
                },
                {
                  icon: '📊',
                  title: 'Conversion Optimization',
                  description: 'Turn more website visitors into leads and customers. We analyze user behavior and optimize your site for maximum conversion rates.'
                },
                {
                  icon: '📈',
                  title: 'Performance Tracking',
                  description: 'Detailed reporting on leads, calls, website traffic, and ROI. Know exactly how your marketing investment is performing.'
                }
              ].map((service) => (
                <div key={service.title} className="bg-white p-10 rounded-3xl shadow-lg text-left border border-slate-100 hover:transform hover:-translate-y-2 transition-all hover:shadow-xl">
                  <div className="w-15 h-15 bg-gradient-to-br from-blue-800 to-blue-600 rounded-2xl flex items-center justify-center text-2xl mb-5 text-white">
                    {service.icon}
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-4">{service.title}</h3>
                  <p className="text-slate-600 leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Industries Section */}
        <section id="industries" className="bg-gradient-to-br from-slate-50 to-slate-200 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Home Services Industries We Serve</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">Specialized marketing strategies for service-based businesses that need local customers.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: '🐛',
                  title: 'Pest Control',
                  description: 'Exterminator lead generation and local SEO'
                },
                {
                  icon: '🔧',
                  title: 'HVAC Services',
                  description: 'Heating, cooling, and air quality leads'
                },
                {
                  icon: '🚰',
                  title: 'Plumbing',
                  description: 'Emergency and residential plumbing calls'
                },
                {
                  icon: '🏠',
                  title: 'Roofing',
                  description: 'Roof repair and replacement projects'
                },
                {
                  icon: '🔐',
                  title: 'Locksmith',
                  description: 'Emergency lockout and security services'
                },
                {
                  icon: '🚪',
                  title: 'Garage Door',
                  description: 'Repair and installation services'
                },
                {
                  icon: '⚡',
                  title: 'Electrician',
                  description: 'Electrical repair and installation leads'
                },
                {
                  icon: '💧',
                  title: 'Water Damage',
                  description: 'Emergency restoration and cleanup'
                },
                {
                  icon: '🍄',
                  title: 'Mold Removal',
                  description: 'Mold remediation and prevention'
                },
                {
                  icon: '🏗️',
                  title: 'General Contractors',
                  description: 'Home improvement and renovation'
                },
                {
                  icon: '🌿',
                  title: 'Landscaping',
                  description: 'Lawn care and outdoor services'
                },
                {
                  icon: '🧽',
                  title: 'Cleaning Services',
                  description: 'Residential and commercial cleaning'
                }
              ].map((industry) => (
                <div key={industry.title} className="bg-white p-6 rounded-2xl shadow-md text-center border-2 border-slate-100 hover:border-blue-600 hover:transform hover:-translate-y-1 transition-all">
                  <div className="text-4xl mb-4">{industry.icon}</div>
                  <h3 className="text-lg font-bold text-slate-800 mb-3">{industry.title}</h3>
                  <p className="text-slate-600 text-sm">{industry.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section id="results" className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Proven Results for Home Services</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">Our data-driven approach delivers measurable growth for our clients.</p>
            </div>
            
            <div className="grid md:grid-cols-4 gap-8 mb-16">
              {[
                {
                  number: '250%',
                  label: 'Average Traffic Increase',
                  description: 'Organic search traffic growth'
                },
                {
                  number: '87%',
                  label: 'Lead Conversion Rate',
                  description: 'Website visitors to leads'
                },
                {
                  number: '3.2x',
                  label: 'ROI Improvement',
                  description: 'Return on marketing investment'
                },
                {
                  number: '45',
                  label: 'Avg Days to Page 1',
                  description: 'Time to first page rankings'
                }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
                  <div className="text-lg font-semibold text-slate-800 mb-1">{stat.label}</div>
                  <div className="text-sm text-slate-600">{stat.description}</div>
                </div>
              ))}
            </div>

            <div className="grid md:grid-cols-2 gap-12">
              {[
                {
                  company: 'ABC Pest Control',
                  industry: 'Pest Control',
                  results: [
                    'Increased organic traffic by 340%',
                    'Generated 180+ new leads per month',
                    'Achieved #1 rankings for 25+ keywords',
                    'ROI of 450% in first 6 months'
                  ]
                },
                {
                  company: 'Elite HVAC Services',
                  industry: 'HVAC',
                  results: [
                    'Doubled website conversion rate',
                    '85 new customers from SEO alone',
                    'Ranking #1-3 for all target keywords',
                    '$125,000 in additional revenue'
                  ]
                }
              ].map((caseStudy, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                      {idx + 1}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">{caseStudy.company}</h3>
                      <p className="text-slate-600">{caseStudy.industry}</p>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {caseStudy.results.map((result, resultIdx) => (
                      <li key={resultIdx} className="flex items-start gap-3 text-slate-700">
                        <span className="text-green-500 font-bold mt-1">✓</span>
                        {result}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section id="process" className="bg-gradient-to-br from-slate-50 to-slate-200 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Our Growth Process</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">A proven 4-step system to grow your home services business.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: '01',
                  title: 'Strategy & Audit',
                  description: 'Comprehensive analysis of your current digital presence, competition, and market opportunities.'
                },
                {
                  step: '02',
                  title: 'Optimize & Build',
                  description: 'Optimize your website, Google Business Profile, and build a strong foundation for growth.'
                },
                {
                  step: '03',
                  title: 'Launch & Scale',
                  description: 'Execute our proven SEO and lead generation strategies to drive traffic and conversions.'
                },
                {
                  step: '04',
                  title: 'Track & Improve',
                  description: 'Monitor performance, refine strategies, and continuously optimize for better results.'
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
            <h2 className="text-4xl font-bold mb-5">Ready to Generate More Leads?</h2>
            <p className="text-xl mb-10 opacity-90">Let's discuss how we can help your home services business grow with proven digital marketing strategies.</p>
            <div className="flex justify-center gap-5 flex-wrap">
              <button 
                onClick={handleContactClick}
                className="px-9 py-5 bg-blue-400 text-gray-800 border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-400/40"
              >
                Get Free Marketing Audit
              </button>
              <a href="tel:+1-555-LEADGEN" className="px-9 py-5 bg-transparent text-white border-2 border-white/30 rounded-xl text-lg font-bold hover:bg-white/10 hover:border-white/50 transition-all">
                Call (555) LEAD-GEN
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
                Lead Train
              </div>
              <p className="text-slate-400 leading-relaxed">
                Digital marketing and lead generation specialists for home services businesses. 
                We help contractors get more leads, calls, and customers through SEO and proven marketing strategies.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Services</h4>
              <ul className="list-none space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Local SEO</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Google Ads</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Lead Generation</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Website Design</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Contact</h4>
              <ul className="list-none space-y-2">
                <li><a href="tel:+1-555-LEADGEN" className="text-slate-400 hover:text-blue-400 transition-colors">(555) LEAD-GEN</a></li>
                <li><a href="mailto:info@leadtrain.net" className="text-slate-400 hover:text-blue-400 transition-colors">info@leadtrain.net</a></li>
                <li><span className="text-slate-400">Mon-Fri 8AM-6PM</span></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Free Consultation</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-5 text-slate-400">
            <div>© 2025 Lead Train. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Case Studies</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal */}
      {isContactOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Get Your Free Marketing Audit</h3>
              <p className="text-gray-600 mb-6">
                Ready to grow your home services business? Let's analyze your current digital marketing 
                and show you exactly how to get more leads and customers.
              </p>
              <div className="space-y-4 mb-6">
                <div className="text-left">
                  <strong className="text-gray-800">📞 Call us:</strong>
                  <p className="text-blue-600 font-semibold">(555) LEAD-GEN</p>
                </div>
                <div className="text-left">
                  <strong className="text-gray-800">✉️ Email us:</strong>
                  <p className="text-blue-600 font-semibold">info@leadtrain.net</p>
                </div>
                <div className="text-left">
                  <strong className="text-gray-800">🎯 We specialize in:</strong>
                  <p className="text-gray-600">HVAC, Plumbing, Pest Control, Roofing, Electrical, and more</p>
                </div>
              </div>
              <button 
                onClick={() => setIsContactOpen(false)}
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
        pageName="Lead Train Homepage"
        devActions={[
          {
            label: 'Test Contact Modal',
            action: () => setIsContactOpen(true),
            variant: 'primary'
          },
          {
            label: 'Scroll to Services',
            action: () => scrollToSection('services'),
            variant: 'success'
          },
          {
            label: 'Scroll to Results',
            action: () => scrollToSection('results'),
            variant: 'warning'
          }
        ]}
      />
    </div>
  )
}