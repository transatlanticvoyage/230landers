'use client'

import { useState, useEffect } from 'react'
import AdminDevPanel from '../../components/AdminDevPanel'

export default function LocalSeoWarpspeedPage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState('accelerator')
  
  useEffect(() => {
    document.title = 'Local SEO Warpspeed - Accelerator Training Program'
  }, [])

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const handleEnrollClick = () => {
    setIsCheckoutOpen(true)
  }

  const modules = [
    {
      week: 'Week 1',
      title: 'Foundation & Client Acquisition',
      topics: [
        'Local SEO fundamentals and market analysis',
        'Client prospecting and outreach strategies',
        'Pricing your services for maximum profit',
        'Sales scripts that close deals',
        'Contract templates and onboarding systems'
      ]
    },
    {
      week: 'Week 2',
      title: 'Google Business Profile Mastery',
      topics: [
        'Complete GBP optimization blueprint',
        'Advanced ranking strategies',
        'Review generation systems',
        'Local Pack domination tactics',
        'Citation building at scale'
      ]
    },
    {
      week: 'Week 3',
      title: 'Advanced Local SEO Tactics',
      topics: [
        'Local keyword research mastery',
        'Content strategy for local businesses',
        'Link building for local sites',
        'Schema markup implementation',
        'Technical SEO for local rankings'
      ]
    },
    {
      week: 'Week 4',
      title: 'Scaling Your Agency',
      topics: [
        'Automation and systems setup',
        'White label fulfillment options',
        'Client retention strategies',
        'Upselling and expansion tactics',
        'Building recurring revenue'
      ]
    }
  ]

  const bonuses = [
    {
      icon: '📚',
      title: 'Complete Template Library',
      value: '$497',
      description: 'Contracts, proposals, reports, and sales materials ready to use'
    },
    {
      icon: '🛠️',
      title: 'SEO Tool Stack Access',
      value: '$297',
      description: 'Exclusive discounts and free trials for premium SEO tools'
    },
    {
      icon: '👥',
      title: 'Private Mastermind Group',
      value: '$197',
      description: 'Lifetime access to our exclusive community of successful local SEO professionals'
    },
    {
      icon: '🎓',
      title: '1-on-1 Coaching Call',
      value: '$297',
      description: '30-minute personal strategy session with our lead instructor'
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white sticky top-0 z-50 shadow-lg">
        <nav className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🚀</span>
              <div className="text-2xl font-bold">
                Local SEO Warpspeed{' '}
                <span className="bg-blue-400 text-gray-800 px-3 py-1 rounded-md text-xl ml-2">
                  by Lead Train
                </span>
              </div>
            </div>
            <ul className="hidden md:flex gap-8 items-center">
              <li><button onClick={() => scrollToSection('curriculum')} className="text-white hover:opacity-80 transition-opacity">Curriculum</button></li>
              <li><button onClick={() => scrollToSection('bonuses')} className="text-white hover:opacity-80 transition-opacity">Bonuses</button></li>
              <li><button onClick={() => scrollToSection('testimonials')} className="text-white hover:opacity-80 transition-opacity">Success Stories</button></li>
              <li><button onClick={() => scrollToSection('faq')} className="text-white hover:opacity-80 transition-opacity">FAQ</button></li>
            </ul>
            <div className="flex gap-4 items-center">
              <button 
                onClick={handleEnrollClick}
                className="px-6 py-3 bg-blue-400 border-none rounded-lg text-gray-800 font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-400/40 uppercase tracking-wider text-sm"
              >
                Enroll Now - $96
              </button>
            </div>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-slate-50 to-slate-200 py-25">
          <div className="max-w-6xl mx-auto px-5 text-center py-20">
            <div className="bg-red-600 text-white px-6 py-2 rounded-full inline-block mb-6 font-bold">
              LIMITED TIME: Save $201 (Regular Price $297)
            </div>
            <h1 className="text-5xl md:text-6xl font-extrabold text-slate-800 mb-5 leading-tight">
              Go From Zero to $10K/Month with Local SEO in 30 Days
            </h1>
            <p className="text-xl text-slate-600 mb-10 max-w-4xl mx-auto">
              The Local SEO Warpspeed Accelerator is an intensive 4-week training program that teaches you exactly how to 
              land high-paying local SEO clients and deliver results that keep them paying month after month.
            </p>
            
            <div className="flex justify-center flex-wrap gap-10 my-10">
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">⚡</span>
                4-Week Fast Track
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">💼</span>
                Ready-to-Use Templates
              </div>
              <div className="flex items-center gap-3 text-slate-600 font-semibold">
                <span className="text-xl">🎯</span>
                Proven Client System
              </div>
            </div>
            
            <div className="flex justify-center gap-5 mt-10 flex-wrap">
              <button 
                onClick={handleEnrollClick}
                className="px-9 py-5 bg-gradient-to-br from-blue-800 to-blue-600 text-white border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-600/30"
              >
                Start Today for Just $96
              </button>
              <button onClick={() => scrollToSection('curriculum')} className="px-9 py-5 bg-white text-blue-600 border-2 border-slate-200 rounded-xl text-lg font-bold hover:border-blue-600 hover:transform hover:-translate-y-1 transition-all">
                See What You'll Learn
              </button>
            </div>

            <div className="mt-8 text-sm text-slate-600">
              🔒 30-Day Money Back Guarantee • 🎓 Lifetime Access • 👥 500+ Successful Students
            </div>
          </div>
        </section>

        {/* Problem/Solution Section */}
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold text-slate-800 mb-6">
                  Stop Trading Time for Money with Low-Paying Clients
                </h2>
                <div className="space-y-4 text-slate-600">
                  <p>
                    Most SEO consultants and agencies struggle because they don't have a systematic approach to:
                  </p>
                  <ul className="space-y-3 ml-6">
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      Finding and closing high-value local business clients
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      Delivering fast, measurable results that justify premium pricing
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      Building systems that scale beyond trading hours for dollars
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-red-500 font-bold">✗</span>
                      Creating recurring revenue that compounds month after month
                    </li>
                  </ul>
                </div>
              </div>
              
              <div>
                <div className="bg-blue-50 p-8 rounded-2xl border-2 border-blue-200">
                  <h3 className="text-2xl font-bold text-blue-800 mb-4">
                    The Warpspeed Solution
                  </h3>
                  <p className="text-slate-700 mb-6">
                    Our accelerator program gives you the exact blueprint, templates, and strategies to:
                  </p>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="text-slate-700">Sign 5-10 clients at $1,000-$2,500/month within 30 days</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="text-slate-700">Deliver ranking improvements in the first 2 weeks</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="text-slate-700">Build automated systems that run without you</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="text-green-500 font-bold">✓</span>
                      <span className="text-slate-700">Scale to $10K+ monthly recurring revenue fast</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Curriculum Section */}
        <section id="curriculum" className="bg-gradient-to-br from-slate-50 to-slate-200 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">4-Week Accelerator Curriculum</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Each week builds on the last, taking you from beginner to profitable local SEO provider in just 30 days.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-8">
              {modules.map((module, idx) => (
                <div key={idx} className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition-shadow">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                      {module.week.split(' ')[1]}
                    </div>
                    <div>
                      <div className="text-sm text-blue-600 font-semibold">{module.week}</div>
                      <h3 className="text-xl font-bold text-slate-800">{module.title}</h3>
                    </div>
                  </div>
                  <ul className="space-y-3">
                    {module.topics.map((topic, topicIdx) => (
                      <li key={topicIdx} className="flex items-start gap-3 text-slate-600">
                        <span className="text-blue-500 mt-1">•</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Bonuses Section */}
        <section id="bonuses" className="py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">
                $1,288 in Bonuses - Included FREE
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Everything you need to succeed, included with your enrollment today.
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {bonuses.map((bonus, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl shadow-lg border-2 border-slate-100 hover:border-blue-500 transition-colors">
                  <div className="text-4xl mb-4">{bonus.icon}</div>
                  <div className="text-lg font-bold text-slate-800 mb-2">{bonus.title}</div>
                  <div className="text-2xl font-bold text-blue-600 mb-3">{bonus.value} Value</div>
                  <p className="text-sm text-slate-600">{bonus.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-gradient-to-br from-slate-50 to-slate-200 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-slate-800 mb-4">Success Stories from Our Students</h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                Real results from people who took action with Local SEO Warpspeed.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  quote: "I went from zero to $8,500/month in recurring revenue in just 6 weeks. The client acquisition scripts alone are worth 10x the price!",
                  author: "Michael Thompson",
                  role: "Digital Marketing Consultant",
                  result: "$8,500/month in 6 weeks"
                },
                {
                  quote: "The GBP optimization strategies got my first client to #1 in the map pack within 10 days. They immediately referred me to 3 other businesses.",
                  author: "Sarah Martinez",
                  role: "SEO Freelancer",
                  result: "4 clients in first month"
                },
                {
                  quote: "Finally, a course that actually teaches you how to GET clients, not just do the work. I signed my first $2,000/month client on day 8!",
                  author: "James Wilson",
                  role: "Agency Owner",
                  result: "$2,000/mo client in 8 days"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="bg-white p-8 rounded-2xl shadow-lg relative">
                  <div className="text-6xl text-blue-500/20 absolute top-3 left-5">"</div>
                  <div className="relative z-10">
                    <p className="text-slate-600 italic mb-6">{testimonial.quote}</p>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg inline-block mb-4">
                      <span className="font-bold text-blue-800">Result: {testimonial.result}</span>
                    </div>
                    <div className="font-semibold text-slate-800">{testimonial.author}</div>
                    <div className="text-slate-500 text-sm">{testimonial.role}</div>
                  </div>
                </div>
              ))}
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
                  q: "Do I need prior SEO experience?",
                  a: "No! We start from the basics and build up. However, if you do have experience, you'll be able to move faster and implement advanced strategies sooner."
                },
                {
                  q: "How quickly can I expect to see results?",
                  a: "Most students land their first client within 2 weeks and see ranking improvements for clients within the first month. Your results depend on how quickly you implement what you learn."
                },
                {
                  q: "Is there ongoing support after the 4 weeks?",
                  a: "Yes! You get lifetime access to the course materials, updates, and our private mastermind community where you can ask questions and network with other successful students."
                },
                {
                  q: "What if I'm not satisfied with the program?",
                  a: "We offer a 30-day money-back guarantee. If you don't feel the program delivers on its promises, just email us for a full refund."
                },
                {
                  q: "Can I really charge $1,000+ per month for local SEO?",
                  a: "Absolutely! We teach you how to position your services, demonstrate value, and deliver results that easily justify premium pricing."
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
        <section className="bg-gradient-to-br from-blue-800 to-blue-600 text-white py-20 text-center">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-4xl font-bold mb-5">Ready to Launch Your Local SEO Business?</h2>
            <p className="text-xl mb-10 opacity-90">
              Join 500+ successful students who are now running profitable local SEO agencies.
            </p>
            
            <div className="bg-white/10 backdrop-blur rounded-2xl p-8 max-w-2xl mx-auto mb-10">
              <div className="text-3xl font-bold mb-4">
                Special Launch Price: <span className="text-yellow-400">$96</span>
              </div>
              <div className="text-lg mb-6 line-through opacity-75">Regular Price: $297</div>
              <div className="text-lg mb-8">Save $201 - Limited Time Only!</div>
              
              <button 
                onClick={handleEnrollClick}
                className="px-9 py-5 bg-blue-400 text-gray-800 border-none rounded-xl text-lg font-bold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-blue-400/40 w-full md:w-auto"
              >
                Enroll Now & Start Today
              </button>
              
              <div className="mt-6 text-sm opacity-90">
                ✓ Instant Access • ✓ 30-Day Guarantee • ✓ Lifetime Updates
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
                Local SEO Warpspeed
              </div>
              <p className="text-slate-400 leading-relaxed">
                The accelerator program for building a profitable local SEO business in 30 days. 
                Learn the exact strategies and systems used by successful agencies.
              </p>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Program</h4>
              <ul className="list-none space-y-2">
                <li><a href="#curriculum" className="text-slate-400 hover:text-blue-400 transition-colors">Curriculum</a></li>
                <li><a href="#bonuses" className="text-slate-400 hover:text-blue-400 transition-colors">Bonuses</a></li>
                <li><a href="#testimonials" className="text-slate-400 hover:text-blue-400 transition-colors">Success Stories</a></li>
                <li><a href="#faq" className="text-slate-400 hover:text-blue-400 transition-colors">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-5 text-white">Support</h4>
              <ul className="list-none space-y-2">
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Contact</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Student Login</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Refund Policy</a></li>
                <li><a href="#" className="text-slate-400 hover:text-blue-400 transition-colors">Terms</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-600 pt-8 flex flex-col md:flex-row justify-between items-center gap-5 text-slate-400">
            <div>© 2025 Lead Train - Local SEO Warpspeed. All rights reserved.</div>
            <div className="flex gap-8">
              <a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-blue-400 transition-colors">Earnings Disclaimer</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-gray-800 mb-4">Complete Your Enrollment</h3>
              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <div className="text-lg font-semibold text-blue-800 mb-2">Local SEO Warpspeed Accelerator</div>
                <div className="text-3xl font-bold text-blue-600 mb-1">$96</div>
                <div className="text-sm text-slate-600 line-through">Regular Price: $297</div>
              </div>
              <p className="text-gray-600 mb-6">
                You're about to get instant access to the complete 4-week accelerator program, 
                all bonuses, and lifetime membership to our community.
              </p>
              <div className="space-y-3 mb-6">
                <div className="text-left border-l-4 border-green-500 pl-4">
                  <strong>✓ Instant Access</strong> to all 4 weeks of content
                </div>
                <div className="text-left border-l-4 border-green-500 pl-4">
                  <strong>✓ $1,288 in Bonuses</strong> included free
                </div>
                <div className="text-left border-l-4 border-green-500 pl-4">
                  <strong>✓ 30-Day Money Back</strong> guarantee
                </div>
              </div>
              <button 
                onClick={() => setIsCheckoutOpen(false)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors w-full font-bold"
              >
                Proceed to Payment
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
        pageName="Local SEO Warpspeed"
        devActions={[
          {
            label: 'Test Checkout Modal',
            action: () => setIsCheckoutOpen(true),
            variant: 'primary'
          },
          {
            label: 'Scroll to Curriculum',
            action: () => scrollToSection('curriculum'),
            variant: 'success'
          },
          {
            label: 'Scroll to Bonuses',
            action: () => scrollToSection('bonuses'),
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