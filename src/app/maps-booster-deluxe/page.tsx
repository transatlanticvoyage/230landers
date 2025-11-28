'use client'

import { useState } from 'react'
import Image from 'next/image'
import AdminDevPanel from '../../components/AdminDevPanel'

interface BusinessInfo {
  businessName: string
  businessType: string
  location: string
  website: string
  description: string
}

interface ContactInfo {
  name: string
  email: string
  phone: string
}

export default function MapsBoosterDeluxePage() {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo>({
    businessName: '',
    businessType: '',
    location: '',
    website: '',
    description: ''
  })
  
  const [contactInfo, setContactInfo] = useState<ContactInfo>({
    name: '',
    email: '',
    phone: ''
  })

  const businessTypes = [
    'Plumbing',
    'Pest Control', 
    'Roofing',
    'HVAC',
    'Electrical',
    'Landscaping',
    'Cleaning Services',
    'Home Renovation',
    'Locksmith',
    'Other'
  ]

  const handleCheckoutOpen = () => {
    setIsCheckoutOpen(true)
    setCurrentStep(1)
    setShowSuccess(false)
    setShowError(false)
    document.body.style.overflow = 'hidden'
  }

  const handleCheckoutClose = () => {
    setIsCheckoutOpen(false)
    document.body.style.overflow = 'auto'
    setCurrentStep(1)
    setShowSuccess(false)
    setShowError(false)
  }

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      return businessInfo.businessName.trim() !== '' && 
             businessInfo.businessType !== '' && 
             businessInfo.location.trim() !== ''
    }
    
    if (step === 2) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return contactInfo.name.trim() !== '' && 
             contactInfo.email.trim() !== '' && 
             emailRegex.test(contactInfo.email) &&
             contactInfo.phone.trim() !== ''
    }
    
    return true
  }

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 3) {
        setCurrentStep(currentStep + 1)
      } else {
        submitOrder()
      }
    }
  }

  const submitOrder = async () => {
    setIsSubmitting(true)
    setShowError(false)

    try {
      const response = await fetch('/api/maps-booster/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          businessInfo,
          contactInfo,
          timestamp: new Date().toISOString()
        })
      })

      const data = await response.json()

      if (data.success) {
        setShowSuccess(true)
        console.log('Order successful:', data.order)
      } else {
        setErrorMessage(data.message || 'Something went wrong. Please try again.')
        setShowError(true)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      setErrorMessage('Network error. Please check your connection and try again.')
      setShowError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-800 to-blue-600 text-white sticky top-0 z-50 shadow-lg">
        <nav className="max-w-6xl mx-auto px-5 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">📍</span>
              <div className="text-2xl font-bold">
                Maps Booster Deluxe{' '}
                <span className="bg-blue-400 text-gray-800 px-3 py-1 rounded-md text-xl ml-2">
                  by Lead Train
                </span>
              </div>
            </div>
            <ul className="hidden md:flex gap-8 items-center">
              <li><a href="#pricing" className="hover:opacity-80 transition-opacity">Pricing</a></li>
              <li><a href="#features" className="hover:opacity-80 transition-opacity">Features</a></li>
              <li><a href="#benefits" className="hover:opacity-80 transition-opacity">Benefits</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-50 to-slate-200 py-20">
          <div className="max-w-6xl mx-auto px-5 text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-blue-800 mb-5 leading-tight">
              Dominate Google Maps<br />Get More Local Customers
            </h1>
            <p className="text-xl text-gray-600 mb-10 max-w-4xl mx-auto">
              Professional Google Business Profile optimization service designed specifically 
              for local service contractors who want to rank #1 in Google Maps
            </p>
            
            {/* Contractor Icons */}
            <div className="flex justify-center flex-wrap gap-6 my-10">
              {[
                { emoji: '🔧', label: 'Plumbing' },
                { emoji: '🐛', label: 'Pest Control' },
                { emoji: '🏠', label: 'Roofing' },
                { emoji: '❄️', label: 'HVAC' },
                { emoji: '⚡', label: 'Electrical' },
                { emoji: '🌱', label: 'Landscaping' }
              ].map((contractor) => (
                <div key={contractor.label} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-shadow min-w-[120px] hover:transform hover:-translate-y-1">
                  <div className="text-3xl mb-2">{contractor.emoji}</div>
                  <div className="text-sm font-semibold text-gray-700">{contractor.label}</div>
                </div>
              ))}
            </div>
            
            <button 
              onClick={handleCheckoutOpen}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white px-10 py-4 rounded-lg text-lg font-bold hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl uppercase tracking-wide"
            >
              Start Dominating Maps Today
            </button>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="py-20">
          <div className="max-w-4xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-blue-800 mb-4">Simple, Effective Pricing</h2>
              <p className="text-xl text-gray-600">One plan that works for every local service contractor</p>
            </div>
            
            <div className="max-w-lg mx-auto">
              <div className="bg-white rounded-2xl shadow-xl border-4 border-green-500 p-8 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-6 py-2 rounded-full text-sm font-semibold">
                  Most Popular
                </div>
                
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-800 mb-2">
                    $500<span className="text-xl font-normal text-gray-600">/month</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-6">Professional Maps Domination</h3>
                  
                  <ul className="text-left space-y-3 mb-8">
                    {[
                      'Complete Google Business Profile optimization',
                      'Strategic review management & acquisition',
                      'Local SEO keyword optimization',
                      'Citation building & NAP consistency',
                      'Google Posts management',
                      'Photo optimization & management',
                      'Competitor analysis & monitoring',
                      'Monthly ranking reports',
                      'Direct phone & email support'
                    ].map((feature) => (
                      <li key={feature} className="flex items-center border-b border-gray-100 pb-3">
                        <span className="text-green-500 mr-3 text-lg">✅</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <div className="bg-yellow-100 border-2 border-yellow-400 rounded-lg p-5 mb-8">
                    <h3 className="text-yellow-800 font-bold mb-2">💡 Our Recommendation</h3>
                    <p className="text-yellow-800">
                      All businesses should start with the $500/month option and, if you are a large business 
                      in a competitive service-location combo, you should ramp up to larger plans later.
                    </p>
                  </div>
                  
                  <button 
                    onClick={handleCheckoutOpen}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-4 rounded-lg text-lg font-bold hover:from-green-600 hover:to-green-700 transform hover:-translate-y-1 transition-all shadow-lg uppercase tracking-wide"
                  >
                    Start Dominating Maps - $500/month
                  </button>
                  
                  <div className="text-center mt-4 text-gray-600">
                    <span className="text-sm">🛡️ 30-Day Money-Back Guarantee</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section id="benefits" className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-blue-800 mb-4">Why Local Contractors Choose Us</h2>
              <p className="text-xl text-gray-600">Proven strategies that get real results for service businesses</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: '🎯',
                  title: 'Local Market Expertise',
                  description: 'We understand the unique challenges facing local service contractors and know exactly how to get you ranking above your competition.'
                },
                {
                  icon: '📈',
                  title: 'Proven Results',
                  description: 'Our clients typically see 3-5x more leads within 90 days. We focus on rankings that actually bring in paying customers.'
                },
                {
                  icon: '🤝',
                  title: 'Hands-On Service',
                  description: 'No automated tools or generic strategies. Every client gets a dedicated specialist who understands your local market.'
                },
                {
                  icon: '🔍',
                  title: 'Complete Transparency',
                  description: 'Monthly reports show exactly what we\'re doing and how your rankings are improving. No black box - you see everything.'
                },
                {
                  icon: '⚡',
                  title: 'Fast Implementation',
                  description: 'We start working on your profile within 24 hours of signup. Most clients see improvements in the first 2 weeks.'
                },
                {
                  icon: '🛡️',
                  title: 'Risk-Free Guarantee',
                  description: 'If you don\'t see measurable improvement in your Google Maps rankings within 30 days, we\'ll refund every penny.'
                }
              ].map((benefit) => (
                <div key={benefit.title} className="bg-white rounded-xl shadow-md p-8 text-center hover:shadow-lg transition-shadow">
                  <div className="text-5xl mb-4">{benefit.icon}</div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{benefit.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Multi-Step Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-500 to-green-600 text-white p-8 rounded-t-3xl relative">
              <button 
                onClick={handleCheckoutClose}
                className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-2xl transition-colors"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold">Get Started with Maps Booster Deluxe</h2>
              <p className="opacity-90">Professional Google Maps optimization service - $500/month</p>
            </div>

            {/* Progress Steps */}
            <div className="flex justify-center p-6 bg-gray-50 border-b">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${
                    currentStep >= step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <div className={`text-sm ml-2 mr-8 ${currentStep >= step ? 'text-green-600 font-semibold' : 'text-gray-400'}`}>
                    {step === 1 && 'Business Info'}
                    {step === 2 && 'Contact Info'}
                    {step === 3 && 'Confirmation'}
                  </div>
                  {step < 3 && <div className="w-8 h-0.5 bg-gray-200 mr-4"></div>}
                </div>
              ))}
            </div>

            {/* Form Steps */}
            <div className="p-8">
              {/* Step 1: Business Information */}
              {currentStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Tell Us About Your Business</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Name *</label>
                      <input 
                        type="text" 
                        value={businessInfo.businessName}
                        onChange={(e) => setBusinessInfo({...businessInfo, businessName: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        placeholder="Enter your business name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Business Type *</label>
                      <select 
                        value={businessInfo.businessType}
                        onChange={(e) => setBusinessInfo({...businessInfo, businessType: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                      >
                        <option value="">Select your business type</option>
                        {businessTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Service Location *</label>
                      <input 
                        type="text" 
                        value={businessInfo.location}
                        onChange={(e) => setBusinessInfo({...businessInfo, location: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        placeholder="e.g., Dallas, TX or Los Angeles County, CA"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Current Website (Optional)</label>
                      <input 
                        type="url" 
                        value={businessInfo.website}
                        onChange={(e) => setBusinessInfo({...businessInfo, website: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        placeholder="https://yourbusiness.com"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Brief Business Description (Optional)</label>
                      <textarea 
                        value={businessInfo.description}
                        onChange={(e) => setBusinessInfo({...businessInfo, description: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        rows={3}
                        placeholder="Tell us briefly about your services..."
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Contact Information */}
              {currentStep === 2 && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Your Name *</label>
                      <input 
                        type="text" 
                        value={contactInfo.name}
                        onChange={(e) => setContactInfo({...contactInfo, name: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        placeholder="Enter your full name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Email Address *</label>
                      <input 
                        type="email" 
                        value={contactInfo.email}
                        onChange={(e) => setContactInfo({...contactInfo, email: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        placeholder="Enter your email address"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Phone Number *</label>
                      <input 
                        type="tel" 
                        value={contactInfo.phone}
                        onChange={(e) => setContactInfo({...contactInfo, phone: e.target.value})}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-green-500 focus:outline-none"
                        placeholder="Enter your phone number"
                      />
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg mt-6">
                    <div className="flex items-start gap-3">
                      <span className="text-blue-600 text-lg">📞</span>
                      <div>
                        <h4 className="font-semibold text-blue-900 mb-1">What happens next?</h4>
                        <p className="text-blue-800 text-sm">
                          Our Google Maps specialist will call you within 24 hours to discuss your business goals 
                          and create a custom optimization strategy. This consultation is completely free.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Confirmation */}
              {currentStep === 3 && !showSuccess && !showError && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Ready to Dominate Google Maps?</h3>
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <h4 className="font-semibold mb-4">Service Summary</h4>
                    <div className="space-y-2 text-sm">
                      <div><span className="font-medium">Business:</span> {businessInfo.businessName}</div>
                      <div><span className="font-medium">Type:</span> {businessInfo.businessType}</div>
                      <div><span className="font-medium">Location:</span> {businessInfo.location}</div>
                      <div><span className="font-medium">Contact:</span> {contactInfo.name} ({contactInfo.email})</div>
                    </div>
                  </div>
                  <div className="bg-green-50 p-6 rounded-xl mb-6">
                    <h4 className="font-semibold text-green-900 mb-3">Maps Booster Deluxe Service - $500/month</h4>
                    <ul className="text-sm text-green-800 space-y-1">
                      <li>✓ Complete Google Business Profile optimization</li>
                      <li>✓ Strategic review management & acquisition</li>
                      <li>✓ Local SEO keyword optimization</li>
                      <li>✓ Citation building & NAP consistency</li>
                      <li>✓ Google Posts management</li>
                      <li>✓ Photo optimization & management</li>
                      <li>✓ Competitor analysis & monitoring</li>
                      <li>✓ Monthly ranking reports</li>
                      <li>✓ Direct phone & email support</li>
                    </ul>
                  </div>
                  <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                    <div className="flex items-start">
                      <span className="text-yellow-600 text-lg mr-2">💡</span>
                      <div>
                        <h4 className="font-semibold text-yellow-900">30-Day Money-Back Guarantee</h4>
                        <p className="text-yellow-800 text-sm">
                          If you don't see measurable improvements in your Google Maps rankings within 30 days, 
                          we'll refund every penny. No questions asked.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Success Screen */}
              {showSuccess && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <div className="text-green-600 text-4xl">✓</div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Welcome to Maps Booster Deluxe!</h2>
                  <p className="text-gray-600 mb-2">Your service request has been submitted successfully.</p>
                  <p className="text-gray-500 mb-6">
                    Our Google Maps specialist will contact you within 24 hours to schedule your free consultation 
                    and begin optimizing your business for local search dominance.
                  </p>
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Next Steps:</h4>
                    <ul className="text-blue-800 text-sm text-left space-y-1">
                      <li>1. Initial consultation call within 24 hours</li>
                      <li>2. Google Business Profile audit</li>
                      <li>3. Custom optimization strategy development</li>
                      <li>4. Implementation begins within 72 hours</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Error Screen */}
              {showError && (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                    <div className="text-red-600 text-4xl">✗</div>
                  </div>
                  <h2 className="text-2xl font-bold mb-3">Submission Failed</h2>
                  <p className="text-gray-600 mb-6">{errorMessage}</p>
                  <button 
                    onClick={() => {
                      setShowError(false)
                      setCurrentStep(2)
                    }}
                    className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Processing State */}
              {isSubmitting && (
                <div className="text-center py-10">
                  <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-green-500 rounded-full animate-spin"></div>
                  <p className="mt-4 text-gray-600">Submitting your request...</p>
                </div>
              )}
            </div>

            {/* Footer */}
            {!showSuccess && !showError && !isSubmitting && (
              <div className="flex justify-between items-center p-8 bg-gray-50 border-t rounded-b-3xl">
                {currentStep > 1 && (
                  <button 
                    onClick={() => setCurrentStep(currentStep - 1)}
                    className="px-8 py-3 bg-white text-gray-600 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Back
                  </button>
                )}
                <div className="flex-1"></div>
                <button 
                  onClick={handleNext}
                  disabled={!validateStep(currentStep)}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg font-semibold hover:transform hover:-translate-y-1 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {currentStep === 3 ? 'Start Service' : 'Continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Admin Dev Panel */}
      <AdminDevPanel 
        pageName="Maps Booster Deluxe"
        devActions={[
          {
            label: 'Auto-Fill Business Info',
            action: () => {
              setBusinessInfo({
                businessName: 'Test HVAC Company',
                businessType: 'HVAC',
                location: 'Dallas, TX',
                website: 'https://testcompany.com',
                description: 'Professional HVAC services for residential and commercial properties'
              })
            },
            variant: 'success'
          },
          {
            label: 'Auto-Fill Contact Info',
            action: () => {
              setContactInfo({
                name: 'John Developer',
                email: 'john.developer@testcompany.com',
                phone: '+1 (555) 123-4567'
              })
            },
            variant: 'success'
          },
          {
            label: 'Open Checkout Modal',
            action: () => {
              handleCheckoutOpen()
            },
            variant: 'primary'
          },
          {
            label: 'Test Submit (Step 3)',
            action: () => {
              setBusinessInfo({
                businessName: 'Test Plumbing Co',
                businessType: 'Plumbing',
                location: 'Los Angeles, CA',
                website: 'https://testplumbing.com',
                description: 'Emergency plumbing services'
              })
              setContactInfo({
                name: 'Jane Developer',
                email: 'jane@testplumbing.com',
                phone: '+1 (555) 987-6543'
              })
              setCurrentStep(3)
              handleCheckoutOpen()
            },
            variant: 'warning'
          }
        ]}
      />
    </div>
  )
}