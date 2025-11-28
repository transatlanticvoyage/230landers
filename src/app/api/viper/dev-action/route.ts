import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

const JWT_SECRET = process.env.VIPER_JWT_SECRET || 'your-secret-key-change-in-production'

interface DevActionRequest {
  page_name: string
  action_type: 'autofill' | 'autosubmit' | 'keyboard_shortcut' | 'manual_dev_button'
  action_name?: string
  step_number?: number
  step_name?: string
  form_data?: any
  success?: boolean
  execution_time_ms?: number
  error_message?: string
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

export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  
  if (!auth) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    const actionData: DevActionRequest = await request.json()

    // Validate required fields
    if (!actionData.page_name || !actionData.action_type) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Get user IP
    const userIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1'

    // Insert dev action log
    const { data: logEntry, error } = await supabase
      .from('viper_dev_actions')
      .insert({
        user_id: auth.userId,
        session_id: auth.sessionId,
        page_name: actionData.page_name,
        action_type: actionData.action_type,
        step_number: actionData.step_number,
        step_name: actionData.step_name || actionData.action_name,
        form_data: actionData.form_data,
        execution_time_ms: actionData.execution_time_ms,
        success: actionData.success !== undefined ? actionData.success : true,
        error_message: actionData.error_message,
        ip_address: userIP
      })
      .select('action_id')
      .single()

    if (error) {
      console.error('Failed to log dev action:', error)
      return NextResponse.json(
        { success: false, message: 'Failed to log action' },
        { status: 500 }
      )
    }

    // Also log to admin audit log for tracking
    await supabase
      .from('viper_admin_audit_log')
      .insert({
        user_id: auth.userId,
        session_id: auth.sessionId,
        action_type: 'dev_action_performed',
        action_category: 'dev_mode',
        target_resource: 'landing_page',
        target_id: actionData.page_name,
        new_values: {
          action_type: actionData.action_type,
          step: actionData.step_number || actionData.step_name,
          execution_time: actionData.execution_time_ms,
          success: actionData.success
        },
        action_result: actionData.success !== false ? 'success' : 'failure',
        ip_address: userIP,
        user_agent: request.headers.get('user-agent')
      })

    return NextResponse.json({
      success: true,
      message: 'Dev action logged successfully',
      action_id: logEntry?.action_id
    })

  } catch (error) {
    console.error('Dev action logging error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
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
    const limit = parseInt(searchParams.get('limit') || '50')

    let query = supabase
      .from('viper_dev_actions')
      .select(`
        action_id,
        page_name,
        action_type,
        step_number,
        step_name,
        execution_time_ms,
        success,
        error_message,
        created_at,
        viper_admin_users!inner(email)
      `)
      .order('created_at', { ascending: false })
      .limit(limit)

    if (page_name) {
      query = query.eq('page_name', page_name)
    }

    const { data: actions, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      actions: actions || []
    })

  } catch (error) {
    console.error('Failed to fetch dev actions:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch dev actions' },
      { status: 500 }
    )
  }
}