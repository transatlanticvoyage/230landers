import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
  process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const JWT_SECRET = process.env.VIPER_JWT_SECRET || 'your-secret-key-change-in-production'

interface AnalyticsEvent {
  page_name: string
  event_type: 'page_load' | 'step_start' | 'step_complete' | 'form_interaction' | 'checkout_open' | 'checkout_abandon' | 'payment_attempt' | 'payment_complete'
  step_number?: number
  step_name?: string
  form_data?: any
  time_spent_seconds?: number
  error_message?: string
  session_id?: string
  user_agent: string
  ip_address: string
}

async function verifyAdminAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('viper_session')?.value
  
  if (!sessionToken) {
    return null
  }

  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET) as any
    
    const { data: session } = await supabase
      .from('viper_admin_sessions')
      .select('session_id, user_id, viper_admin_users!inner(email, role, is_active)')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single()

    if (!session) {
      return null
    }

    return {
      userId: session.user_id,
      sessionId: session.session_id,
      email: (session as any).viper_admin_users.email,
      role: (session as any).viper_admin_users.role
    }
  } catch (error) {
    return null
  }
}

// POST - Track analytics event
export async function POST(request: NextRequest) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return NextResponse.json({
      success: false,
      message: 'Analytics system not configured'
    })
  }

  try {
    const eventData: AnalyticsEvent = await request.json()

    // Get user IP and session info
    const userIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1'
    
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Generate or use existing session ID for tracking user journeys
    const visitorSessionId = eventData.session_id || `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

    // Insert into page analytics table
    const { data: analyticsEntry, error } = await supabase
      .from('viper_page_analytics')
      .insert({
        page_name: eventData.page_name,
        visitor_ip: userIP,
        user_agent: userAgent,
        event_type: eventData.event_type,
        step_number: eventData.step_number,
        step_name: eventData.step_name,
        form_data: eventData.form_data,
        time_spent_seconds: eventData.time_spent_seconds,
        error_message: eventData.error_message,
        visitor_session_id: visitorSessionId,
        dev_mode_active: false, // This is for regular user tracking
        created_at: new Date().toISOString()
      })
      .select('analytics_id')
      .single()

    if (error) {
      console.error('Analytics tracking error:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to track analytics' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      session_id: visitorSessionId,
      analytics_id: analyticsEntry?.analytics_id
    })

  } catch (error) {
    console.error('Analytics API error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// GET - Retrieve analytics data (admin only)
export async function GET(request: NextRequest) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return NextResponse.json({
      success: false,
      message: 'Analytics system not configured'
    })
  }

  const auth = await verifyAdminAuth(request)
  
  if (!auth) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    const { searchParams } = new URL(request.url)
    const page_name = searchParams.get('page_name')
    const session_id = searchParams.get('session_id')
    const days = parseInt(searchParams.get('days') || '7')
    const limit = parseInt(searchParams.get('limit') || '100')

    let query = supabase
      .from('viper_page_analytics')
      .select('*')
      .gte('created_at', new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString())
      .order('created_at', { ascending: false })
      .limit(limit)

    if (page_name) {
      query = query.eq('page_name', page_name)
    }

    if (session_id) {
      query = query.eq('visitor_session_id', session_id)
    }

    const { data: analytics, error } = await query

    if (error) {
      throw error
    }

    // Group by sessions for journey analysis
    const sessionMap = new Map()
    
    analytics?.forEach(event => {
      const sessionId = event.visitor_session_id
      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, {
          session_id: sessionId,
          visitor_ip: event.visitor_ip,
          user_agent: event.user_agent,
          first_seen: event.created_at,
          last_seen: event.created_at,
          events: [],
          steps_completed: [],
          total_time_seconds: 0,
          conversion_status: 'abandoned',
          furthest_step: 0
        })
      }
      
      const session = sessionMap.get(sessionId)
      session.events.push(event)
      session.last_seen = event.created_at
      
      if (event.step_number && event.event_type === 'step_complete') {
        session.steps_completed.push(event.step_number)
        session.furthest_step = Math.max(session.furthest_step, event.step_number)
      }
      
      if (event.time_spent_seconds) {
        session.total_time_seconds += event.time_spent_seconds
      }
      
      if (event.event_type === 'payment_complete') {
        session.conversion_status = 'converted'
      }
    })

    const sessions = Array.from(sessionMap.values())
      .sort((a, b) => new Date(b.first_seen).getTime() - new Date(a.first_seen).getTime())

    // Calculate summary stats
    const totalSessions = sessions.length
    const convertedSessions = sessions.filter(s => s.conversion_status === 'converted').length
    const conversionRate = totalSessions > 0 ? (convertedSessions / totalSessions * 100) : 0

    const stepAnalysis = {
      step_1_starts: sessions.filter(s => s.furthest_step >= 1).length,
      step_2_starts: sessions.filter(s => s.furthest_step >= 2).length,
      step_3_starts: sessions.filter(s => s.furthest_step >= 3).length,
      step_4_starts: sessions.filter(s => s.furthest_step >= 4).length,
      completions: convertedSessions
    }

    return NextResponse.json({
      success: true,
      summary: {
        total_sessions: totalSessions,
        converted_sessions: convertedSessions,
        conversion_rate: Math.round(conversionRate * 100) / 100,
        step_analysis: stepAnalysis,
        date_range_days: days
      },
      sessions: sessions,
      raw_events: analytics
    })

  } catch (error) {
    console.error('Analytics fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch analytics' },
      { status: 500 }
    )
  }
}