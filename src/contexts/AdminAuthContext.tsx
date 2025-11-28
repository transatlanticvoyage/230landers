'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface AdminUser {
  id: string
  email: string
  role: 'admin' | 'super_admin'
}

interface ViperConfig {
  [key: string]: {
    value: any
    type: string
    description: string
    environment: string
    updated_at: string
  }
}

interface AdminAuthContextType {
  // Authentication state
  isAuthenticated: boolean
  user: AdminUser | null
  isLoading: boolean
  
  // Configuration state
  config: ViperConfig | null
  isDevModeEnabled: boolean
  
  // Authentication methods
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>
  logout: () => Promise<void>
  checkAuth: () => Promise<void>
  
  // Configuration methods
  updateConfig: (updates: Record<string, any>) => Promise<{ success: boolean; message: string }>
  toggleDevMode: (value?: boolean) => Promise<{ success: boolean; message: string }>
  refreshConfig: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<AdminUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [config, setConfig] = useState<ViperConfig | null>(null)
  const [isDevModeEnabled, setIsDevModeEnabled] = useState(false)

  // Check authentication status on mount
  useEffect(() => {
    checkAuth()
  }, [])

  // Update dev mode status when config changes
  useEffect(() => {
    if (config?.dev_mode_enabled) {
      setIsDevModeEnabled(config.dev_mode_enabled.value === true)
    }
  }, [config])

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/viper/auth', {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        await refreshConfig()
      } else {
        setUser(null)
        setIsAuthenticated(false)
        setConfig(null)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
      setConfig(null)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/viper/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success && data.user) {
        setUser(data.user)
        setIsAuthenticated(true)
        await refreshConfig()
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message || 'Login failed' }
      }
    } catch (error) {
      console.error('Login error:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/viper/auth', {
        method: 'DELETE',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      setConfig(null)
      setIsDevModeEnabled(false)
    }
  }

  const refreshConfig = async () => {
    if (!isAuthenticated) return

    try {
      const response = await fetch('/api/viper/config', {
        method: 'GET',
        credentials: 'include'
      })

      const data = await response.json()

      if (data.success && data.config) {
        setConfig(data.config)
      }
    } catch (error) {
      console.error('Failed to fetch config:', error)
    }
  }

  const updateConfig = async (updates: Record<string, any>): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/viper/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ updates }),
      })

      const data = await response.json()

      if (data.success) {
        await refreshConfig()
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message || 'Update failed' }
      }
    } catch (error) {
      console.error('Config update error:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const toggleDevMode = async (value?: boolean): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch('/api/viper/config', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          action: 'toggle_dev_mode',
          value 
        }),
      })

      const data = await response.json()

      if (data.success) {
        setIsDevModeEnabled(data.dev_mode_enabled)
        await refreshConfig()
        return { success: true, message: data.message }
      } else {
        return { success: false, message: data.message || 'Toggle failed' }
      }
    } catch (error) {
      console.error('Dev mode toggle error:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const value: AdminAuthContextType = {
    // Authentication state
    isAuthenticated,
    user,
    isLoading,
    
    // Configuration state
    config,
    isDevModeEnabled,
    
    // Authentication methods
    login,
    logout,
    checkAuth,
    
    // Configuration methods
    updateConfig,
    toggleDevMode,
    refreshConfig,
  }

  return (
    <AdminAuthContext.Provider value={value}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}

// Hook for components to check if dev mode is enabled
export function useDevMode() {
  const { isAuthenticated, isDevModeEnabled } = useAdminAuth()
  return {
    isDevModeEnabled: isAuthenticated && isDevModeEnabled,
    isAuthenticated
  }
}

// Hook for conditional dev features
export function useDevFeatures() {
  const { isAuthenticated, isDevModeEnabled, user } = useAdminAuth()
  
  return {
    showDevButtons: isAuthenticated && isDevModeEnabled,
    canAutoFill: isAuthenticated && isDevModeEnabled,
    canUseShortcuts: isAuthenticated && isDevModeEnabled,
    isAdmin: isAuthenticated,
    isSuperAdmin: isAuthenticated && user?.role === 'super_admin'
  }
}