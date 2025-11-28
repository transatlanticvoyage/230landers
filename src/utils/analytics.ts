// Analytics tracking utility for Viper system
// Tracks user progression through checkout flows

interface AnalyticsEvent {
  page_name: string
  event_type: 'page_load' | 'step_start' | 'step_complete' | 'form_interaction' | 'checkout_open' | 'checkout_abandon' | 'payment_attempt' | 'payment_complete'
  step_number?: number
  step_name?: string
  form_data?: any
  time_spent_seconds?: number
  error_message?: string
}

class ViperAnalytics {
  private sessionId: string | null = null
  private stepStartTimes: Map<number, number> = new Map()
  private isTrackingEnabled: boolean = true

  constructor() {
    // Generate or retrieve session ID
    this.sessionId = this.getOrCreateSessionId()
  }

  private getOrCreateSessionId(): string {
    // Check if we're on the client side
    if (typeof window === 'undefined') {
      return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    }

    // Check if we have an existing session ID in sessionStorage
    const existingSessionId = sessionStorage.getItem('viper_session_id')
    if (existingSessionId) {
      return existingSessionId
    }

    // Create new session ID
    const newSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    sessionStorage.setItem('viper_session_id', newSessionId)
    return newSessionId
  }

  private async sendEvent(event: AnalyticsEvent): Promise<void> {
    if (!this.isTrackingEnabled) return
    
    // Only track on client side
    if (typeof window === 'undefined') return

    try {
      const response = await fetch('/api/viper/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...event,
          session_id: this.sessionId,
          user_agent: navigator.userAgent
        }),
      })
      
      if (!response.ok) {
        const data = await response.json()
        if (data.message === 'Analytics system not configured') {
          // Silently disable tracking if system not configured
          this.isTrackingEnabled = false
        }
      }
    } catch (error) {
      // Silently fail for analytics to not affect user experience
      this.isTrackingEnabled = false
    }
  }

  // Track page load
  trackPageLoad(pageName: string): void {
    this.sendEvent({
      page_name: pageName,
      event_type: 'page_load'
    })
  }

  // Track checkout modal opening
  trackCheckoutOpen(pageName: string): void {
    this.sendEvent({
      page_name: pageName,
      event_type: 'checkout_open'
    })
  }

  // Track checkout modal closing/abandonment
  trackCheckoutAbandon(pageName: string, currentStep: number): void {
    this.sendEvent({
      page_name: pageName,
      event_type: 'checkout_abandon',
      step_number: currentStep
    })
  }

  // Track step start
  trackStepStart(pageName: string, stepNumber: number, stepName: string): void {
    this.stepStartTimes.set(stepNumber, Date.now())
    this.sendEvent({
      page_name: pageName,
      event_type: 'step_start',
      step_number: stepNumber,
      step_name: stepName
    })
  }

  // Track step completion
  trackStepComplete(pageName: string, stepNumber: number, stepName: string, formData?: any): void {
    const startTime = this.stepStartTimes.get(stepNumber)
    const timeSpent = startTime ? Math.round((Date.now() - startTime) / 1000) : undefined

    // Sanitize form data (remove sensitive info)
    const sanitizedData = this.sanitizeFormData(formData)

    this.sendEvent({
      page_name: pageName,
      event_type: 'step_complete',
      step_number: stepNumber,
      step_name: stepName,
      form_data: sanitizedData,
      time_spent_seconds: timeSpent
    })
  }

  // Track form interactions (field changes, validations)
  trackFormInteraction(pageName: string, stepNumber: number, fieldName: string, action: string): void {
    this.sendEvent({
      page_name: pageName,
      event_type: 'form_interaction',
      step_number: stepNumber,
      form_data: {
        field_name: fieldName,
        action: action // 'focus', 'blur', 'change', 'error'
      }
    })
  }

  // Track payment attempt
  trackPaymentAttempt(pageName: string, plan: string, amount: number): void {
    this.sendEvent({
      page_name: pageName,
      event_type: 'payment_attempt',
      step_number: 4,
      step_name: 'Payment Processing',
      form_data: {
        plan: plan,
        amount: amount
      }
    })
  }

  // Track successful payment
  trackPaymentComplete(pageName: string, orderId: string, plan: string, amount: number): void {
    this.sendEvent({
      page_name: pageName,
      event_type: 'payment_complete',
      step_number: 4,
      step_name: 'Payment Complete',
      form_data: {
        order_id: orderId,
        plan: plan,
        amount: amount
      }
    })
  }

  // Track errors
  trackError(pageName: string, stepNumber: number, errorMessage: string): void {
    this.sendEvent({
      page_name: pageName,
      event_type: 'form_interaction',
      step_number: stepNumber,
      error_message: errorMessage
    })
  }

  // Sanitize form data to remove sensitive information
  private sanitizeFormData(data: any): any {
    if (!data) return null

    const sanitized = { ...data }

    // Remove sensitive fields
    const sensitiveFields = [
      'password', 'confirmPassword', 'cardNumber', 'cvv', 'ssn', 'creditCard'
    ]

    sensitiveFields.forEach(field => {
      if (sanitized[field]) {
        sanitized[field] = '[REDACTED]'
      }
    })

    // Partially mask email and phone
    if (sanitized.email) {
      const [local, domain] = sanitized.email.split('@')
      sanitized.email = `${local.substring(0, 2)}***@${domain}`
    }

    if (sanitized.phone) {
      sanitized.phone = sanitized.phone.replace(/\d(?=\d{4})/g, '*')
    }

    return sanitized
  }

  // Get current session ID
  getSessionId(): string | null {
    return this.sessionId
  }

  // Enable/disable tracking
  setTrackingEnabled(enabled: boolean): void {
    this.isTrackingEnabled = enabled
  }
}

// Create global instance
const analytics = new ViperAnalytics()

export default analytics