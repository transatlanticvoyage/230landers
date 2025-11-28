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

// Middleware to verify admin authentication
async function verifyAdminAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('viper_session')?.value
  
  if (!sessionToken) {
    return null
  }

  try {
    const decoded = jwt.verify(sessionToken, JWT_SECRET) as any
    
    // Verify session is still active
    const { data: session } = await supabase
      .from('viper_admin_sessions')
      .select('session_id, user_id, viper_admin_users!inner(email, role, is_active)')
      .eq('session_token', sessionToken)
      .eq('is_active', true)
      .single()

    if (!session || new Date() > new Date((session as any).expires_at)) {
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

// GET - Fetch all configuration
export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  
  if (!auth) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    const { data: configs, error } = await supabase
      .from('viper_config')
      .select('*')
      .order('config_key')

    if (error) {
      throw error
    }

    // Convert to key-value object for easier frontend usage
    const configObject = configs.reduce((acc: any, config) => {
      acc[config.config_key] = {
        value: config.config_value,
        type: config.data_type,
        description: config.description,
        environment: config.environment,
        updated_at: config.updated_at
      }
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      config: configObject
    })

  } catch (error) {
    console.error('Config fetch error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to fetch configuration' },
      { status: 500 }
    )
  }
}

// POST - Update configuration
export async function POST(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  
  if (!auth) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    )
  }

  // Only super_admin can modify config
  if (auth.role !== 'super_admin') {
    return NextResponse.json(
      { success: false, message: 'Super admin access required' },
      { status: 403 }
    )
  }

  try {
    const { updates } = await request.json()

    if (!updates || typeof updates !== 'object') {
      return NextResponse.json(
        { success: false, message: 'Invalid updates format' },
        { status: 400 }
      )
    }

    const results = []

    // Process each update
    for (const [key, value] of Object.entries(updates)) {
      // Get current config to check if it exists
      const { data: currentConfig } = await supabase
        .from('viper_config')
        .select('*')
        .eq('config_key', key)
        .single()

      if (currentConfig) {
        // Update existing config
        const { data: updated, error } = await supabase
          .from('viper_config')
          .update({
            config_value: value,
            updated_by: auth.userId,
            updated_at: new Date().toISOString()
          })
          .eq('config_key', key)
          .select()

        if (error) {
          console.error(`Failed to update ${key}:`, error)
          continue
        }

        results.push({ key, action: 'updated', success: true })

        // Log the configuration change
        await supabase
          .from('viper_admin_audit_log')
          .insert({
            user_id: auth.userId,
            session_id: auth.sessionId,
            action_type: 'config_update',
            action_category: 'config',
            target_resource: 'viper_config',
            target_id: key,
            old_values: { [key]: currentConfig.config_value },
            new_values: { [key]: value },
            action_result: 'success',
            ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1'
          })

      } else {
        results.push({ key, action: 'skipped', success: false, reason: 'Config key not found' })
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Configuration updated',
      results
    })

  } catch (error) {
    console.error('Config update error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to update configuration' },
      { status: 500 }
    )
  }
}

// PUT - Toggle dev mode specifically (common operation)
export async function PUT(request: NextRequest) {
  const auth = await verifyAdminAuth(request)
  
  if (!auth) {
    return NextResponse.json(
      { success: false, message: 'Authentication required' },
      { status: 401 }
    )
  }

  try {
    const { action, value } = await request.json()

    if (action === 'toggle_dev_mode') {
      // Get current dev mode status
      const { data: currentConfig } = await supabase
        .from('viper_config')
        .select('config_value')
        .eq('config_key', 'dev_mode_enabled')
        .single()

      const newValue = value !== undefined ? value : !(currentConfig?.config_value)

      // Update dev mode
      const { error } = await supabase
        .from('viper_config')
        .update({
          config_value: newValue,
          updated_by: auth.userId,
          updated_at: new Date().toISOString()
        })
        .eq('config_key', 'dev_mode_enabled')

      if (error) {
        throw error
      }

      // Log the dev mode toggle
      await supabase
        .from('viper_admin_audit_log')
        .insert({
          user_id: auth.userId,
          session_id: auth.sessionId,
          action_type: 'dev_mode_toggle',
          action_category: 'dev_mode',
          target_resource: 'viper_config',
          target_id: 'dev_mode_enabled',
          old_values: { dev_mode_enabled: currentConfig?.config_value },
          new_values: { dev_mode_enabled: newValue },
          action_result: 'success',
          ip_address: request.headers.get('x-forwarded-for') || '127.0.0.1'
        })

      return NextResponse.json({
        success: true,
        message: `Dev mode ${newValue ? 'enabled' : 'disabled'}`,
        dev_mode_enabled: newValue
      })
    }

    return NextResponse.json(
      { success: false, message: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Dev mode toggle error:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to toggle dev mode' },
      { status: 500 }
    )
  }
}