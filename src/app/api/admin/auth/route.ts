import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
// Updated for git staging trigger

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()
    
    // Check admin credentials (in production, use proper authentication)
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@leadtrain.net'
    const devPassword = process.env.DEV_MODE_PASSWORD || 'dev123'
    
    if (email === adminEmail && password === devPassword) {
      // Set admin session cookie (expires in 24 hours)
      const cookieStore = await cookies()
      cookieStore.set('admin_authenticated', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60, // 24 hours
        path: '/'
      })
      
      return NextResponse.json({
        success: true,
        message: 'Admin authentication successful',
        adminMode: true
      })
    }
    
    return NextResponse.json(
      { success: false, message: 'Invalid admin credentials' },
      { status: 401 }
    )
    
  } catch (error) {
    console.error('Admin auth error:', error)
    
    return NextResponse.json(
      { success: false, message: 'Authentication server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies()
    const isAuthenticated = cookieStore.get('admin_authenticated')?.value === 'true'
    
    return NextResponse.json({
      success: true,
      adminMode: isAuthenticated,
      adminModeEnabled: process.env.ADMIN_MODE_ENABLED === 'true'
    })
    
  } catch (error) {
    console.error('Admin status check error:', error)
    
    return NextResponse.json(
      { success: false, message: 'Status check error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    // Logout - clear admin session
    const cookieStore = await cookies()
    cookieStore.delete('admin_authenticated')
    
    return NextResponse.json({
      success: true,
      message: 'Admin logout successful',
      adminMode: false
    })
    
  } catch (error) {
    console.error('Admin logout error:', error)
    
    return NextResponse.json(
      { success: false, message: 'Logout error' },
      { status: 500 }
    )
  }
}