'use client'

import { useState, useEffect } from 'react'
import ViperDevPanel from '../../components/ViperDevPanel'
import StepDevButtons from '../../components/StepDevButtons'
import { useDevFeatures } from '../../contexts/AdminAuthContext'
import analytics from '../../utils/analytics'

interface OrderData {
  account?: {
    firstName: string
    lastName: string
    email: string
    company: string
    phone: string
    website: string
  }
  payment?: {
    cardLast4: string
    cardName: string
    billingAddress: string
    billingCity: string
    billingState: string
    billingZip: string
    billingCountry: string
  }
  plan?: string
  amount?: number
  timestamp?: string
}

export default function RanktrackerPage() {
  const { showDevButtons, canAutoFill } = useDevFeatures()
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)
  
  const [currentStep, setCurrentStep] = useState(1)
  const [selectedPlan, setSelectedPlan] = useState('professional')
  const [orderData, setOrderData] = useState<OrderData>({})
  const [isProcessing, setIsProcessing] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [passwordStrength, setPasswordStrength] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  // Analytics tracking
  useEffect(() => {
    analytics.trackPageLoad('MoonTracker')
  }, [])

  // Track step changes
  useEffect(() => {
    if (isCheckoutOpen && currentStep) {
      const stepNames = {
        1: 'Plan Selection',
        2: 'Account Information', 
        3: 'Payment Information',
        4: 'Order Confirmation'
      }
      analytics.trackStepStart('MoonTracker', currentStep, stepNames[currentStep as keyof typeof stepNames])
    }
  }, [currentStep, isCheckoutOpen])

  const planPrices = {
    starter: 29,
    professional: 79,
    agency: 199
  }

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  const openCheckout = (plan?: string) => {
    if (plan) {
      setSelectedPlan(plan)
    }
    setIsCheckoutOpen(true)
    document.body.style.overflow = 'hidden'
    
    // Track checkout opening
    analytics.trackCheckoutOpen('MoonTracker')
  }

  const closeCheckout = () => {
    // Track checkout abandonment (only if not completed)
    if (!showSuccess) {
      analytics.trackCheckoutAbandon('MoonTracker', currentStep)
    }
    
    setIsCheckoutOpen(false)
    document.body.style.overflow = 'auto'
    setCurrentStep(1)
    setShowSuccess(false)
    setShowError(false)
    setIsProcessing(false)
  }

  const goToStep = (step: number) => {
    if (step < 1 || step > 4) return
    setCurrentStep(step)
  }

  const validateStep = (step: number): boolean => {
    if (step === 1) {
      // Track step 1 completion
      analytics.trackStepComplete('MoonTracker', 1, 'Plan Selection', {
        selected_plan: selectedPlan,
        promo_applied: promoApplied,
        price: getDiscountedPrice()
      })
      return true
    }
    
    if (step === 2) {
      const form = document.getElementById('step2Form') as HTMLFormElement
      const requiredFields = form.querySelectorAll('[required]') as NodeListOf<HTMLInputElement>
      let isValid = true

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('border-red-500')
          isValid = false
        } else {
          field.classList.remove('border-red-500')
        }
      })

      const email = document.getElementById('email') as HTMLInputElement
      if (email.value && !isValidEmail(email.value)) {
        email.classList.add('border-red-500')
        isValid = false
      }

      const password = document.getElementById('password') as HTMLInputElement
      const confirmPassword = document.getElementById('confirmPassword') as HTMLInputElement

      if (password.value.length < 8) {
        password.classList.add('border-red-500')
        isValid = false
      }

      if (password.value !== confirmPassword.value) {
        confirmPassword.classList.add('border-red-500')
        isValid = false
      }

      if (isValid) {
        const accountData = {
          firstName: (document.getElementById('firstName') as HTMLInputElement).value,
          lastName: (document.getElementById('lastName') as HTMLInputElement).value,
          email: email.value,
          company: (document.getElementById('company') as HTMLInputElement).value,
          phone: (document.getElementById('phone') as HTMLInputElement).value,
          website: (document.getElementById('website') as HTMLInputElement).value
        }
        
        setOrderData(prev => ({
          ...prev,
          account: accountData
        }))

        // Track step 2 completion with sanitized data
        analytics.trackStepComplete('MoonTracker', 2, 'Account Information', {
          firstName: accountData.firstName,
          lastName: accountData.lastName,
          email: accountData.email,
          company: accountData.company,
          phone: accountData.phone,
          website: accountData.website
        })
      }

      return isValid
    }

    if (step === 3) {
      const form = document.getElementById('step3Form') as HTMLFormElement
      const requiredFields = form.querySelectorAll('[required]') as NodeListOf<HTMLInputElement>
      let isValid = true

      requiredFields.forEach(field => {
        if (!field.value.trim()) {
          field.classList.add('border-red-500')
          isValid = false
        } else {
          field.classList.remove('border-red-500')
        }
      })

      const cardNumber = (document.getElementById('cardNumber') as HTMLInputElement).value.replace(/\s/g, '')
      if (cardNumber.length < 13 || cardNumber.length > 19) {
        (document.getElementById('cardNumber') as HTMLInputElement).classList.add('border-red-500')
        isValid = false
      }

      const expiry = (document.getElementById('cardExpiry') as HTMLInputElement).value
      if (!expiry.match(/^(0[1-9]|1[0-2])\/([0-9]{2})$/)) {
        (document.getElementById('cardExpiry') as HTMLInputElement).classList.add('border-red-500')
        isValid = false
      }

      const cvc = (document.getElementById('cardCvc') as HTMLInputElement).value
      if (!cvc.match(/^[0-9]{3,4}$/)) {
        (document.getElementById('cardCvc') as HTMLInputElement).classList.add('border-red-500')
        isValid = false
      }

      const agreeTerms = document.getElementById('agreeTerms') as HTMLInputElement
      if (!agreeTerms.checked) {
        isValid = false
      }

      if (isValid) {
        const paymentData = {
          cardLast4: cardNumber.slice(-4),
          cardName: (document.getElementById('cardName') as HTMLInputElement).value,
          billingAddress: (document.getElementById('billingAddress') as HTMLInputElement).value,
          billingCity: (document.getElementById('billingCity') as HTMLInputElement).value,
          billingState: (document.getElementById('billingState') as HTMLInputElement).value,
          billingZip: (document.getElementById('billingZip') as HTMLInputElement).value,
          billingCountry: (document.getElementById('billingCountry') as HTMLInputElement).value
        }
        
        setOrderData(prev => ({
          ...prev,
          payment: paymentData
        }))

        // Track step 3 completion with sanitized payment data
        analytics.trackStepComplete('MoonTracker', 3, 'Payment Information', {
          cardLast4: paymentData.cardLast4,
          cardName: paymentData.cardName,
          billingCity: paymentData.billingCity,
          billingState: paymentData.billingState,
          billingCountry: paymentData.billingCountry
        })
      }

      return isValid
    }

    return true
  }

  const isValidEmail = (email: string): boolean => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const handleNextStep = () => {
    if (currentStep === 4) {
      processPayment()
    } else if (validateStep(currentStep)) {
      goToStep(currentStep + 1)
    }
  }

  const processPayment = async () => {
    setIsProcessing(true)
    setShowError(false)

    const finalOrderData = {
      ...orderData,
      plan: selectedPlan,
      amount: getDiscountedPrice(),
      timestamp: new Date().toISOString()
    }

    // Track payment attempt
    analytics.trackPaymentAttempt('MoonTracker', selectedPlan, getDiscountedPrice())

    try {
      const response = await fetch('/api/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(finalOrderData)
      })

      const data = await response.json()

      if (data.success) {
        setShowSuccess(true)
        console.log('Payment successful:', data.order)
        
        // Track successful payment completion
        analytics.trackPaymentComplete('MoonTracker', data.order?.id || 'unknown', selectedPlan, getDiscountedPrice())
      } else {
        setErrorMessage(data.message || 'Payment processing failed. Please try again.')
        setShowError(true)
        
        // Track payment failure
        analytics.trackError('MoonTracker', 4, data.message || 'Payment processing failed')
      }
    } catch (error) {
      console.error('Payment error:', error)
      setErrorMessage('Network error. Please check your connection and try again.')
      setShowError(true)
      
      // Track network error
      analytics.trackError('MoonTracker', 4, 'Network error during payment processing')
    } finally {
      setIsProcessing(false)
    }
  }

  // Auto-fill functions for dev mode
  const autoFillStep1 = () => {
    setSelectedPlan('professional')
    // Apply promo code
    const promoInput = document.getElementById('promoCode') as HTMLInputElement
    if (promoInput) {
      promoInput.value = 'SAVE20'
      applyPromoCode()
    }
  }

  const autoFillStep2 = () => {
    const fields = {
      firstName: 'Jane',
      lastName: 'Developer',
      email: 'jane.dev@testcompany.com',
      company: 'Test Marketing Inc',
      phone: '+1 (555) 987-6543',
      website: 'https://testmarketing.com',
      password: 'testpass123',
      confirmPassword: 'testpass123'
    }

    Object.entries(fields).forEach(([id, value]) => {
      const element = document.getElementById(id) as HTMLInputElement
      if (element) {
        element.value = value
        element.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })
  }

  const autoFillStep3 = () => {
    const fields = {
      cardNumber: '4242 4242 4242 4242',
      expiryDate: '12/25',
      cvv: '123',
      cardholderName: 'Jane Developer',
      billingAddress: '123 Test Street',
      billingCity: 'Los Angeles',
      billingState: 'CA',
      billingZip: '90210'
    }

    Object.entries(fields).forEach(([id, value]) => {
      const element = document.getElementById(id) as HTMLInputElement
      if (element) {
        element.value = value
        element.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    // Check terms agreement
    const agreeTerms = document.getElementById('agreeTerms') as HTMLInputElement
    if (agreeTerms) {
      agreeTerms.checked = true
    }
  }

  // Auto-submit functions for dev mode
  const autoSubmitStep1 = async () => {
    setCurrentStep(2)
  }

  const autoSubmitStep2 = async () => {
    if (validateStep(2)) {
      setCurrentStep(3)
    }
  }

  const autoSubmitStep3 = async () => {
    if (validateStep(3)) {
      setCurrentStep(4)
    }
  }

  const formatCardNumber = (value: string) => {
    const cleanValue = value.replace(/\s/g, '')
    return cleanValue.match(/.{1,4}/g)?.join(' ') || cleanValue
  }

  const formatExpiry = (value: string) => {
    const cleanValue = value.replace(/\D/g, '')
    if (cleanValue.length >= 2) {
      return cleanValue.slice(0, 2) + '/' + cleanValue.slice(2, 4)
    }
    return cleanValue
  }

  const checkPasswordStrength = (password: string) => {
    if (password.length < 6) {
      setPasswordStrength('weak')
    } else if (password.length < 10 || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
      setPasswordStrength('medium')
    } else {
      setPasswordStrength('strong')
    }
  }

  const applyPromoCode = () => {
    const promoCode = (document.getElementById('promoCode') as HTMLInputElement).value.trim()
    if (promoCode.toUpperCase() === 'SAVE20') {
      setPromoApplied(true)
    }
  }

  const getDiscountedPrice = () => {
    const basePrice = planPrices[selectedPlan as keyof typeof planPrices]
    return promoApplied ? basePrice * 0.8 : basePrice
  }

  useEffect(() => {
    return () => {
      document.body.style.overflow = 'auto'
    }
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-600 to-purple-700">
      {/* Header */}
      <header className="bg-white/98 shadow-lg sticky top-0 z-40">
        <nav className="max-w-6xl mx-auto px-5 py-5">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-extrabold bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
              🌙 MoonTracker
            </div>
            <ul className="hidden md:flex gap-8">
              <li><button onClick={() => scrollToSection('features')} className="text-gray-600 hover:text-indigo-500 font-medium transition-colors">Features</button></li>
              <li><button onClick={() => scrollToSection('pricing')} className="text-gray-600 hover:text-indigo-500 font-medium transition-colors">Pricing</button></li>
              <li><button onClick={() => scrollToSection('testimonials')} className="text-gray-600 hover:text-indigo-500 font-medium transition-colors">Testimonials</button></li>
              <li><a href="#contact" className="text-gray-600 hover:text-indigo-500 font-medium transition-colors">Contact</a></li>
            </ul>
          </div>
        </nav>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-25 text-center text-white">
          <div className="max-w-6xl mx-auto px-5 py-20">
            <h1 className="text-5xl md:text-6xl font-extrabold mb-5 text-shadow-lg">
              Track Your Rankings to the Moon 🚀
            </h1>
            <p className="text-xl mb-10 opacity-95 max-w-3xl mx-auto">
              The most accurate SEO rank tracking software for agencies and professionals
            </p>
            <button 
              onClick={() => openCheckout('professional')}
              className="inline-block px-10 py-5 bg-white text-indigo-500 rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-xl cursor-pointer"
            >
              Start Free 14-Day Trial
            </button>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="bg-white py-20 -mt-12 rounded-t-3xl">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-center text-4xl font-bold mb-16 text-gray-800">Why Choose MoonTracker?</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  icon: '📊',
                  title: 'Real-Time Tracking',
                  description: 'Monitor your keyword rankings in real-time across Google, Bing, and Yahoo. Get instant notifications when rankings change.'
                },
                {
                  icon: '🌍',
                  title: 'Local & Global',
                  description: 'Track rankings in 190+ countries and 50,000+ locations. Perfect for local SEO and international campaigns.'
                },
                {
                  icon: '📱',
                  title: 'Mobile & Desktop',
                  description: 'Separate tracking for mobile and desktop rankings. Understand how your site performs on different devices.'
                },
                {
                  icon: '🔗',
                  title: 'Competitor Analysis',
                  description: 'Track your competitors\' rankings alongside yours. Discover opportunities and stay ahead of the competition.'
                },
                {
                  icon: '📈',
                  title: 'White Label Reports',
                  description: 'Create beautiful, branded reports for your clients. Automated reporting saves you hours every month.'
                },
                {
                  icon: '🔌',
                  title: 'API Access',
                  description: 'Integrate MoonTracker data into your own tools and dashboards. Full REST API with comprehensive documentation.'
                }
              ].map((feature) => (
                <div key={feature.title} className="p-8 bg-gray-50 rounded-2xl hover:transform hover:-translate-y-2 transition-all hover:shadow-lg">
                  <div className="text-5xl mb-5">{feature.icon}</div>
                  <h3 className="text-xl font-bold mb-4 text-gray-800">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-gray-50 py-20">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-center text-4xl font-bold mb-16 text-gray-800">Simple, Transparent Pricing</h2>
            <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
              {[
                {
                  plan: 'starter',
                  name: 'Starter',
                  price: 29,
                  features: ['✓ 250 Keywords', '✓ 5 Websites', '✓ Daily Rank Updates', '✓ 3 Competitors', '✓ Email Support', '✓ CSV Export']
                },
                {
                  plan: 'professional',
                  name: 'Professional',
                  price: 79,
                  popular: true,
                  features: ['✓ 1,000 Keywords', '✓ 25 Websites', '✓ Real-time Updates', '✓ 10 Competitors', '✓ Priority Support', '✓ White Label Reports', '✓ API Access']
                },
                {
                  plan: 'agency',
                  name: 'Agency',
                  price: 199,
                  features: ['✓ 5,000 Keywords', '✓ Unlimited Websites', '✓ Real-time Updates', '✓ Unlimited Competitors', '✓ Dedicated Account Manager', '✓ Custom Integrations', '✓ Advanced API Access']
                }
              ].map((planData) => (
                <div key={planData.plan} className={`bg-white rounded-3xl p-10 text-center relative transition-all hover:transform hover:-translate-y-2 hover:shadow-xl ${planData.popular ? 'transform scale-105 shadow-2xl border-4 border-indigo-500' : 'shadow-lg'}`}>
                  {planData.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                      MOST POPULAR
                    </div>
                  )}
                  <h3 className="text-2xl font-bold mb-3 text-gray-800">{planData.name}</h3>
                  <div className="text-5xl font-extrabold text-indigo-500 mb-2">${planData.price}</div>
                  <div className="text-gray-500 text-lg mb-8">per month</div>
                  <ul className="list-none mb-10 space-y-3">
                    {planData.features.map((feature, idx) => (
                      <li key={idx} className="py-3 text-gray-600 border-b border-gray-100 last:border-b-0">{feature}</li>
                    ))}
                  </ul>
                  <button 
                    onClick={() => openCheckout(planData.plan)}
                    className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-full text-lg font-semibold hover:transform hover:-translate-y-1 transition-all shadow-lg hover:shadow-indigo-500/30"
                  >
                    Start Free Trial
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section id="testimonials" className="bg-white py-20">
          <div className="max-w-6xl mx-auto px-5">
            <h2 className="text-center text-4xl font-bold mb-16 text-gray-800">What Our Customers Say</h2>
            <div className="grid md:grid-cols-3 gap-10">
              {[
                {
                  quote: "MoonTracker has completely transformed how we manage SEO campaigns. The accuracy is unmatched and the reporting features save us hours every week.",
                  author: "Sarah Johnson",
                  role: "Marketing Director, TechCorp"
                },
                {
                  quote: "The local tracking features are game-changing for our multi-location clients. We can track rankings down to the zip code level with perfect accuracy.",
                  author: "Michael Chen",
                  role: "SEO Manager, Local Digital Agency"
                },
                {
                  quote: "Best rank tracker I've used in 10 years of SEO. The API integration lets us build custom dashboards that our clients love. Worth every penny!",
                  author: "David Martinez",
                  role: "Founder, SEO Specialists Inc"
                }
              ].map((testimonial, idx) => (
                <div key={idx} className="p-8 bg-gray-50 rounded-2xl relative">
                  <div className="text-6xl text-indigo-500/30 absolute top-3 left-5">"</div>
                  <p className="text-gray-600 italic mb-5 relative z-10">{testimonial.quote}</p>
                  <div className="font-semibold text-gray-800">{testimonial.author}</div>
                  <div className="text-gray-500 text-sm">{testimonial.role}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer id="contact" className="bg-gray-800 text-white py-10 text-center">
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex justify-center gap-8 mb-5">
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">Support</a>
            <a href="#" className="text-gray-400 hover:text-white transition-colors">API Docs</a>
          </div>
          <p className="text-gray-400">&copy; 2025 MoonTracker. All rights reserved.</p>
        </div>
      </footer>

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto relative">
            {/* Header */}
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-8 rounded-t-3xl relative">
              <button 
                onClick={closeCheckout}
                className="absolute top-5 right-5 w-10 h-10 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center text-2xl transition-colors"
              >
                &times;
              </button>
              <h2 className="text-2xl font-bold">Complete Your Order</h2>
              <p className="opacity-90">Start your 14-day free trial of MoonTracker</p>
            </div>

            {/* Steps */}
            <div className="flex justify-between p-8 bg-gray-50 border-b">
              {[1, 2, 3, 4].map((step) => (
                <div key={step} className="flex-1 text-center relative">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold mb-2 mx-auto relative z-10 ${
                    currentStep === step ? 'bg-indigo-500 text-white' : 
                    currentStep > step ? 'bg-green-500 text-white' : 
                    'bg-gray-200 text-gray-400'
                  }`}>
                    {step}
                  </div>
                  <div className={`text-sm ${currentStep === step ? 'text-indigo-500 font-semibold' : 'text-gray-500'}`}>
                    {step === 1 && 'Plan Selection'}
                    {step === 2 && 'Account Info'}
                    {step === 3 && 'Payment'}
                    {step === 4 && 'Confirmation'}
                  </div>
                  {step < 4 && (
                    <div className="absolute top-5 right-0 w-full h-0.5 bg-gray-200 transform translate-x-1/2"></div>
                  )}
                </div>
              ))}
            </div>

            {/* Body */}
            <div className="p-8">
              {currentStep === 1 && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Select Your Plan</h3>
                  
                  <StepDevButtons
                    stepNumber={1}
                    stepName="Plan Selection"
                    pageName="MoonTracker"
                    onAutoFill={autoFillStep1}
                    onAutoSubmit={autoSubmitStep1}
                  />
                  <div className="grid md:grid-cols-3 gap-5 mb-8">
                    {[
                      { plan: 'starter', name: 'Starter', price: 29, features: ['250 Keywords', '5 Websites', 'Daily Updates'] },
                      { plan: 'professional', name: 'Professional', price: 79, features: ['1,000 Keywords', '25 Websites', 'Real-time Updates'] },
                      { plan: 'agency', name: 'Agency', price: 199, features: ['5,000 Keywords', 'Unlimited Websites', 'Dedicated Manager'] }
                    ].map((planOption) => (
                      <div 
                        key={planOption.plan}
                        className={`border-2 rounded-xl p-5 cursor-pointer transition-all hover:border-indigo-500 hover:transform hover:-translate-y-1 ${
                          selectedPlan === planOption.plan ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'
                        }`}
                        onClick={() => setSelectedPlan(planOption.plan)}
                      >
                        <input 
                          type="radio" 
                          checked={selectedPlan === planOption.plan} 
                          onChange={() => setSelectedPlan(planOption.plan)}
                          className="sr-only"
                        />
                        <div className="text-lg font-semibold mb-2">{planOption.name}</div>
                        <div className="text-3xl font-bold text-indigo-500 mb-3">
                          ${planOption.price}<span className="text-base font-normal">/mo</span>
                        </div>
                        <ul className="text-sm space-y-1">
                          {planOption.features.map((feature, idx) => (
                            <li key={idx}>✓ {feature}</li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-3 mb-5">
                    <input 
                      type="text" 
                      id="promoCode"
                      placeholder="Promo Code (Optional)" 
                      className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                    <button 
                      onClick={applyPromoCode}
                      className="px-6 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600"
                    >
                      Apply
                    </button>
                  </div>
                  {promoApplied && (
                    <div className="text-green-600 text-sm">Promo code applied successfully!</div>
                  )}
                </div>
              )}

              {currentStep === 2 && (
                <form id="step2Form">
                  <h3 className="text-xl font-bold mb-6">Create Your Account</h3>
                  
                  <StepDevButtons
                    stepNumber={2}
                    stepName="Account Information"
                    pageName="MoonTracker"
                    onAutoFill={autoFillStep2}
                    onAutoSubmit={autoSubmitStep2}
                  />
                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">First Name *</label>
                      <input 
                        type="text" 
                        id="firstName"
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Last Name *</label>
                      <input 
                        type="text" 
                        id="lastName"
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Email Address *</label>
                    <input 
                      type="email" 
                      id="email"
                      required 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Company Name</label>
                    <input 
                      type="text" 
                      id="company"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">Password *</label>
                      <input 
                        type="password" 
                        id="password"
                        required 
                        onChange={(e) => checkPasswordStrength(e.target.value)}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                      <div className="h-1 bg-gray-200 rounded mt-2">
                        <div className={`h-full rounded transition-all ${
                          passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                          passwordStrength === 'medium' ? 'w-2/3 bg-orange-500' :
                          passwordStrength === 'strong' ? 'w-full bg-green-500' : 'w-0'
                        }`}></div>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirm Password *</label>
                      <input 
                        type="password" 
                        id="confirmPassword"
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Phone Number</label>
                    <input 
                      type="tel" 
                      id="phone"
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Website URL *</label>
                    <input 
                      type="url" 
                      id="website"
                      placeholder="https://example.com"
                      required 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </form>
              )}

              {currentStep === 3 && (
                <form id="step3Form">
                  <h3 className="text-xl font-bold mb-6">Payment Information</h3>
                  
                  <StepDevButtons
                    stepNumber={3}
                    stepName="Payment Information"
                    pageName="MoonTracker"
                    onAutoFill={autoFillStep3}
                    onAutoSubmit={autoSubmitStep3}
                  />
                  <div className="flex items-center gap-3 text-green-600 mb-6">
                    <span>🔒</span>
                    <span className="text-sm">Your payment information is encrypted and secure</span>
                  </div>
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <div className="mb-5">
                      <label className="block text-sm font-medium mb-2">Card Number *</label>
                      <input 
                        type="text" 
                        id="cardNumber"
                        placeholder="1234 5678 9012 3456"
                        maxLength={19}
                        required 
                        onChange={(e) => {
                          e.target.value = formatCardNumber(e.target.value)
                        }}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none font-mono tracking-wider"
                      />
                    </div>
                    <div className="grid md:grid-cols-2 gap-5 mb-5">
                      <div>
                        <label className="block text-sm font-medium mb-2">Expiry Date *</label>
                        <input 
                          type="text" 
                          id="cardExpiry"
                          placeholder="MM/YY"
                          maxLength={5}
                          required 
                          onChange={(e) => {
                            e.target.value = formatExpiry(e.target.value)
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">CVC *</label>
                        <input 
                          type="text" 
                          id="cardCvc"
                          placeholder="123"
                          maxLength={4}
                          required 
                          onChange={(e) => {
                            e.target.value = e.target.value.replace(/\D/g, '')
                          }}
                          className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    <div className="mb-5">
                      <label className="block text-sm font-medium mb-2">Cardholder Name *</label>
                      <input 
                        type="text" 
                        id="cardName"
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <h4 className="text-lg font-semibold mb-5">Billing Address</h4>
                  <div className="mb-5">
                    <label className="block text-sm font-medium mb-2">Street Address *</label>
                    <input 
                      type="text" 
                      id="billingAddress"
                      required 
                      className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">City *</label>
                      <input 
                        type="text" 
                        id="billingCity"
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">State/Province *</label>
                      <input 
                        type="text" 
                        id="billingState"
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="grid md:grid-cols-2 gap-5 mb-5">
                    <div>
                      <label className="block text-sm font-medium mb-2">ZIP/Postal Code *</label>
                      <input 
                        type="text" 
                        id="billingZip"
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Country *</label>
                      <select 
                        id="billingCountry"
                        required 
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-indigo-500 focus:outline-none"
                      >
                        <option value="">Select Country</option>
                        <option value="US">United States</option>
                        <option value="CA">Canada</option>
                        <option value="GB">United Kingdom</option>
                        <option value="AU">Australia</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-5">
                    <label className="flex items-center gap-3">
                      <input 
                        type="checkbox" 
                        id="agreeTerms"
                        required 
                        className="w-4 h-4"
                      />
                      <span className="text-sm">I agree to the <a href="#" className="text-indigo-500">Terms of Service</a> and <a href="#" className="text-indigo-500">Privacy Policy</a></span>
                    </label>
                  </div>
                </form>
              )}

              {currentStep === 4 && (
                <div>
                  <h3 className="text-xl font-bold mb-6">Order Summary</h3>
                  
                  <StepDevButtons
                    stepNumber={4}
                    stepName="Order Confirmation"
                    pageName="MoonTracker"
                    onAutoSubmit={processPayment}
                    autoSubmitLabel="Complete Order"
                    showSubmitButton={true}
                  />
                  <div className="bg-gray-50 p-6 rounded-xl mb-6">
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span>Plan:</span>
                      <span className="font-semibold">{selectedPlan.charAt(0).toUpperCase() + selectedPlan.slice(1)}</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span>Billing Cycle:</span>
                      <span>Monthly</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span>Free Trial:</span>
                      <span>14 Days</span>
                    </div>
                    <div className="flex justify-between py-3 border-b border-gray-200">
                      <span>Subtotal:</span>
                      <span>${planPrices[selectedPlan as keyof typeof planPrices]}.00</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between py-3 border-b border-gray-200">
                        <span>Discount (20%):</span>
                        <span className="text-green-600">-${(planPrices[selectedPlan as keyof typeof planPrices] * 0.2).toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between py-4 font-bold text-lg">
                      <span>Total (after trial):</span>
                      <span>${getDiscountedPrice().toFixed(2)}/mo</span>
                    </div>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg mb-6">
                    <strong>💳 Billing Information:</strong>
                    <p className="text-gray-600 mt-2">You won't be charged today. Your free trial starts immediately and you can cancel anytime during the trial period.</p>
                  </div>
                  
                  {isProcessing && (
                    <div className="text-center py-10">
                      <div className="inline-block w-12 h-12 border-4 border-gray-200 border-t-indigo-500 rounded-full animate-spin"></div>
                      <p className="mt-4 text-gray-600">Processing your order...</p>
                    </div>
                  )}
                  
                  {showSuccess && (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <div className="text-green-600 text-4xl">✓</div>
                      </div>
                      <h2 className="text-2xl font-bold mb-3">Welcome to MoonTracker!</h2>
                      <p className="text-gray-600 mb-2">Your account has been created successfully.</p>
                      <p className="text-gray-500 mb-6">Check your email for login instructions and getting started guide.</p>
                      <button className="px-8 py-3 bg-indigo-500 text-white rounded-lg font-semibold hover:bg-indigo-600">
                        Go to Dashboard
                      </button>
                    </div>
                  )}
                  
                  {showError && (
                    <div className="text-center py-10">
                      <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-5">
                        <div className="text-red-600 text-4xl">✗</div>
                      </div>
                      <h2 className="text-2xl font-bold mb-3">Payment Failed</h2>
                      <p className="text-gray-600 mb-6">{errorMessage || 'There was an error processing your payment. Please try again.'}</p>
                      <button 
                        onClick={() => {
                          setShowError(false)
                          setCurrentStep(3)
                        }}
                        className="px-8 py-3 bg-red-500 text-white rounded-lg font-semibold hover:bg-red-600"
                      >
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {!showSuccess && !showError && !isProcessing && (
              <div className="flex justify-between items-center p-8 bg-gray-50 border-t rounded-b-3xl">
                {currentStep > 1 && (
                  <button 
                    onClick={() => goToStep(currentStep - 1)}
                    className="px-8 py-3 bg-white text-gray-600 border-2 border-gray-200 rounded-lg font-semibold hover:bg-gray-50"
                  >
                    Previous
                  </button>
                )}
                <div className="flex-1"></div>
                <button 
                  onClick={handleNextStep}
                  className="px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg font-semibold hover:transform hover:-translate-y-1 transition-all shadow-lg"
                >
                  {currentStep === 4 ? 'Complete Order' : 'Continue'}
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Viper Dev Panel */}
      <ViperDevPanel 
        pageName="MoonTracker"
        devActions={[
          {
            label: 'Auto-Fill Account Info',
            action: () => {
              const firstNameInput = document.getElementById('firstName') as HTMLInputElement
              const lastNameInput = document.getElementById('lastName') as HTMLInputElement
              const emailInput = document.getElementById('email') as HTMLInputElement
              const companyInput = document.getElementById('company') as HTMLInputElement
              const passwordInput = document.getElementById('password') as HTMLInputElement
              const confirmPasswordInput = document.getElementById('confirmPassword') as HTMLInputElement
              const phoneInput = document.getElementById('phone') as HTMLInputElement
              const websiteInput = document.getElementById('website') as HTMLInputElement

              if (firstNameInput) firstNameInput.value = 'John'
              if (lastNameInput) lastNameInput.value = 'Developer'
              if (emailInput) emailInput.value = 'john.developer@testcompany.com'
              if (companyInput) companyInput.value = 'Test Company LLC'
              if (passwordInput) passwordInput.value = 'TestPassword123!'
              if (confirmPasswordInput) confirmPasswordInput.value = 'TestPassword123!'
              if (phoneInput) phoneInput.value = '+1 (555) 123-4567'
              if (websiteInput) websiteInput.value = 'https://testcompany.com'
            },
            variant: 'success'
          },
          {
            label: 'Auto-Fill Payment Info',
            action: () => {
              const cardNumberInput = document.getElementById('cardNumber') as HTMLInputElement
              const cardExpiryInput = document.getElementById('cardExpiry') as HTMLInputElement
              const cardCvcInput = document.getElementById('cardCvc') as HTMLInputElement
              const cardNameInput = document.getElementById('cardName') as HTMLInputElement
              const billingAddressInput = document.getElementById('billingAddress') as HTMLInputElement
              const billingCityInput = document.getElementById('billingCity') as HTMLInputElement
              const billingStateInput = document.getElementById('billingState') as HTMLInputElement
              const billingZipInput = document.getElementById('billingZip') as HTMLInputElement
              const billingCountryInput = document.getElementById('billingCountry') as HTMLSelectElement
              const agreeTermsInput = document.getElementById('agreeTerms') as HTMLInputElement

              if (cardNumberInput) cardNumberInput.value = '4242 4242 4242 4242'
              if (cardExpiryInput) cardExpiryInput.value = '12/25'
              if (cardCvcInput) cardCvcInput.value = '123'
              if (cardNameInput) cardNameInput.value = 'John Developer'
              if (billingAddressInput) billingAddressInput.value = '123 Test Street'
              if (billingCityInput) billingCityInput.value = 'Test City'
              if (billingStateInput) billingStateInput.value = 'CA'
              if (billingZipInput) billingZipInput.value = '90210'
              if (billingCountryInput) billingCountryInput.value = 'US'
              if (agreeTermsInput) agreeTermsInput.checked = true
            },
            variant: 'success'
          },
          {
            label: 'Open Checkout (Professional)',
            action: () => {
              openCheckout('professional')
            },
            variant: 'primary'
          },
          {
            label: 'Jump to Step 3 (Confirmation)',
            action: () => {
              openCheckout('professional')
              setTimeout(() => {
                setCurrentStep(3)
              }, 500)
            },
            variant: 'warning'
          },
          {
            label: 'Apply Promo Code (SAVE20)',
            action: () => {
              const promoInput = document.getElementById('promoCode') as HTMLInputElement
              if (promoInput) {
                promoInput.value = 'SAVE20'
                applyPromoCode()
              }
            },
            variant: 'primary'
          }
        ]}
      />
    </div>
  )
}