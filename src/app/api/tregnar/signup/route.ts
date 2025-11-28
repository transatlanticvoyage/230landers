import { NextResponse } from 'next/server'
// Updated for git staging trigger

export async function POST(request: Request) {
  try {
    const body = await request.json()
    
    // Validate required fields for Tregnar SaaS signup
    const { plan, account, payment, timestamp } = body
    
    if (!account) {
      return NextResponse.json(
        { success: false, message: 'Missing account information' },
        { status: 400 }
      )
    }

    // Validate account information
    if (!account.email || !account.firstName || !account.lastName) {
      return NextResponse.json(
        { success: false, message: 'Missing required account details' },
        { status: 400 }
      )
    }

    // Determine plan pricing
    const planPricing = {
      starter: { price: 49, name: 'Starter' },
      professional: { price: 149, name: 'Professional' },
      enterprise: { price: 399, name: 'Enterprise' }
    }

    const selectedPlan = planPricing[plan as keyof typeof planPricing] || planPricing.professional

    // In a real implementation, this is where you would:
    // 1. Create user account with authentication
    // 2. Set up SaaS subscription billing
    // 3. Initialize user workspace and dashboards
    // 4. Set up integrations (WordPress, hosting APIs, etc.)
    // 5. Send welcome email with login credentials
    // 6. Provision API access based on plan
    // 7. Set up initial data imports

    console.log('Processing Tregnar SaaS signup:', {
      plan: selectedPlan.name,
      price: selectedPlan.price,
      customerEmail: account.email,
      timestamp: timestamp || new Date().toISOString()
    })

    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Generate SaaS account data
    const saasAccount = {
      userId: `tgn_${Date.now()}`,
      plan: {
        name: selectedPlan.name,
        price: selectedPlan.price,
        features: getPlanFeatures(plan)
      },
      account: {
        name: `${account.firstName} ${account.lastName}`,
        email: account.email,
        company: account.company || null,
        website: account.website || null
      },
      subscription: {
        status: 'trial',
        trialEnds: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 14 days
        billingCycle: 'monthly',
        nextBilling: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()
      },
      workspace: {
        dashboardUrl: 'https://app.tregnar.com/dashboard',
        apiKey: `tgn_${Math.random().toString(36).substring(2, 15)}`,
        limits: getPlanLimits(plan)
      },
      status: 'active_trial',
      createdAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      message: 'Tregnar account created successfully',
      account: saasAccount
    })

  } catch (error) {
    console.error('Tregnar signup error:', error)
    
    return NextResponse.json(
      { success: false, message: 'Internal server error during account creation' },
      { status: 500 }
    )
  }
}

function getPlanFeatures(plan: string): string[] {
  const features = {
    starter: [
      'Manage up to 10 WordPress sites',
      'Basic local market research',
      'Standard Reddit content mining',
      'Email support',
      'Basic analytics dashboard'
    ],
    professional: [
      'Manage up to 100 WordPress sites',
      'Advanced local market research',
      'Advanced Reddit content mining & filtering',
      'PBN link analysis',
      'Priority support',
      'Advanced analytics & reporting',
      'API access',
      'White-label options'
    ],
    enterprise: [
      'Unlimited WordPress sites',
      'Complete market research suite',
      'Advanced Reddit & social mining',
      'Full PBN management tools',
      'Dedicated account manager',
      'Custom integrations',
      'Advanced API access',
      'Full white-label solution',
      'Custom training & onboarding'
    ]
  }
  
  return features[plan as keyof typeof features] || features.professional
}

function getPlanLimits(plan: string) {
  const limits = {
    starter: {
      maxSites: 10,
      maxKeywords: 500,
      maxReports: 10,
      apiCallsPerMonth: 10000
    },
    professional: {
      maxSites: 100,
      maxKeywords: 5000,
      maxReports: 100,
      apiCallsPerMonth: 100000
    },
    enterprise: {
      maxSites: -1, // unlimited
      maxKeywords: -1, // unlimited
      maxReports: -1, // unlimited
      apiCallsPerMonth: 1000000
    }
  }
  
  return limits[plan as keyof typeof limits] || limits.professional
}