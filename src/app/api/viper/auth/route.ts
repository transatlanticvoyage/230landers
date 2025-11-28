import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// Use service role to bypass RLS for admin operations
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

interface LoginRequest {
  email: string
  password: string
}

export async function POST(request: NextRequest) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return NextResponse.json({
      success: false,
      message: 'System not configured'
    })
  }

  try {
    const { email, password }: LoginRequest = await request.json()

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    // Get user IP
    const userIP = request.headers.get('x-forwarded-for') || 
                   request.headers.get('x-real-ip') || 
                   '127.0.0.1'

    // Check for rate limiting
    const { data: recentAttempts } = await supabase
      .from('viper_admin_users')
      .select('failed_login_attempts, last_failed_attempt_at')
      .eq('email', email)
      .single()

    if (recentAttempts && recentAttempts.failed_login_attempts >= 5) {
      const lastAttempt = new Date(recentAttempts.last_failed_attempt_at)
      const hourAgo = new Date(Date.now() - 60 * 60 * 1000)
      
      if (lastAttempt > hourAgo) {
        return NextResponse.json(
          { success: false, message: 'Too many login attempts. Try again in 1 hour.' },
          { status: 429 }
        )
      }
    }

    // Get user from database
    const { data: user, error: userError } = await supabase
      .from('viper_admin_users')
      .select('admin_user_id, email, password_hash, role, is_active')
      .eq('email', email)
      .single()

    if (userError || !user || !user.is_active) {
      // Log failed attempt
      if (user) {
        await supabase
          .from('viper_admin_users')
          .update({
            failed_login_attempts: (recentAttempts?.failed_login_attempts || 0) + 1,
            last_failed_attempt_at: new Date().toISOString()
          })
          .eq('admin_user_id', user.admin_user_id)
      }

      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    
    if (!isValidPassword) {
      // Log failed attempt
      await supabase
        .from('viper_admin_users')
        .update({
          failed_login_attempts: (recentAttempts?.failed_login_attempts || 0) + 1,
          last_failed_attempt_at: new Date().toISOString()
        })
        .eq('admin_user_id', user.admin_user_id)

      return NextResponse.json(
        { success: false, message: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Clear failed attempts and update login info
    await supabase
      .from('viper_admin_users')
      .update({
        failed_login_attempts: 0,
        last_failed_attempt_at: null,
        last_login_at: new Date().toISOString(),
        login_count: (user as any).login_count + 1
      })
      .eq('admin_user_id', user.admin_user_id)

    // Create session token
    const sessionToken = jwt.sign(
      {
        userId: user.admin_user_id,
        email: user.email,
        role: user.role,
        ip: userIP
      },
      JWT_SECRET,
      { expiresIn: '8h' }
    )

    // Store session in database
    const expiresAt = new Date(Date.now() + 8 * 60 * 60 * 1000) // 8 hours
    const { data: session } = await supabase
      .from('viper_admin_sessions')
      .insert({
        user_id: user.admin_user_id,
        session_token: sessionToken,
        ip_address: userIP,
        user_agent: request.headers.get('user-agent') || 'unknown',
        expires_at: expiresAt.toISOString()
      })
      .select('session_id')
      .single()

    // Log successful login
    await supabase
      .from('viper_admin_audit_log')
      .insert({
        user_id: user.admin_user_id,
        session_id: session?.session_id,
        action_type: 'login',
        action_category: 'auth',
        action_result: 'success',
        ip_address: userIP,
        user_agent: request.headers.get('user-agent')
      })

    // Set HTTP-only cookie
    const response = NextResponse.json({
      success: true,
      message: 'Authentication successful',
      user: {
        id: user.admin_user_id,
        email: user.email,
        role: user.role
      }
    })

    response.cookies.set('viper_session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours in seconds
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Viper auth error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}

// Logout endpoint
export async function DELETE(request: NextRequest) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return NextResponse.json({
      success: false,
      message: 'System not configured'
    })
  }

  try {
    const sessionToken = request.cookies.get('viper_session')?.value

    if (sessionToken) {
      // Verify and decode token
      const decoded = jwt.verify(sessionToken, JWT_SECRET) as any

      // Deactivate session in database
      await supabase
        .from('viper_admin_sessions')
        .update({
          is_active: false,
          logout_reason: 'manual'
        })
        .eq('session_token', sessionToken)

      // Log logout
      await supabase
        .from('viper_admin_audit_log')
        .insert({
          user_id: decoded.userId,
          action_type: 'logout',
          action_category: 'auth',
          action_result: 'success',
          ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1'
        })
    }

    // Clear cookie
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })

    response.cookies.delete('viper_session')

    return response

  } catch (error) {
    console.error('Logout error:', error)
    const response = NextResponse.json({
      success: true,
      message: 'Logged out successfully'
    })
    response.cookies.delete('viper_session')
    return response
  }
}

// Verify session endpoint
export async function GET(request: NextRequest) {
  // Check if Supabase is configured
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL === 'https://placeholder.supabase.co') {
    return NextResponse.json({
      success: false,
      message: 'System not configured'
    })
  }

  try {
    const sessionToken = request.cookies.get('viper_session')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { success: false, message: 'No session found' },
        { status: 401 }
      )
    }

    // Verify JWT
    const decoded = jwt.verify(sessionToken, JWT_SECRET) as any

    // Check if session exists and is active in database
    const { data: session, error } = await supabase
      .from('viper_admin_sessions')
      .select(`
        session_id,
        user_id,
        expires_at,
        is_active,
        viper_admin_users!inner(email, role, is_active)
      `)
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single()

    if (error || !session || new Date(session.expires_at) < new Date()) {
      return NextResponse.json(
        { success: false, message: 'Session expired or invalid' },
        { status: 401 }
      )
    }

    // Update last used timestamp
    await supabase
      .from('viper_admin_sessions')
      .update({ last_used_at: new Date().toISOString() })
      .eq('session_id', session.session_id)

    return NextResponse.json({
      success: true,
      user: {
        id: session.user_id,
        email: (session as any).viper_admin_users.email,
        role: (session as any).viper_admin_users.role
      }
    })

  } catch (error) {
    console.error('Session verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Invalid session' },
      { status: 401 }
    )
  }
}