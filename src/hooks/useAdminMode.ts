'use client'

import { useState, useEffect } from 'react'

interface AdminModeState {
  isAdminMode: boolean
  isAdminModeEnabled: boolean
  isLoading: boolean
  error: string | null
}

export function useAdminMode() {
  const [state, setState] = useState<AdminModeState>({
    isAdminMode: false,
    isAdminModeEnabled: false,
    isLoading: true,
    error: null
  })

  const checkAdminStatus = async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await fetch('/api/admin/auth', {
        method: 'GET',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          isAdminMode: data.adminMode,
          isAdminModeEnabled: data.adminModeEnabled,
          isLoading: false
        }))
      } else {
        setState(prev => ({
          ...prev,
          isAdminMode: false,
          isAdminModeEnabled: false,
          isLoading: false,
          error: data.message
        }))
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isAdminMode: false,
        isAdminModeEnabled: false,
        isLoading: false,
        error: 'Failed to check admin status'
      }))
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }))
      
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password })
      })
      
      const data = await response.json()
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          isAdminMode: true,
          isLoading: false
        }))
        return true
      } else {
        setState(prev => ({
          ...prev,
          isAdminMode: false,
          isLoading: false,
          error: data.message
        }))
        return false
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        isAdminMode: false,
        isLoading: false,
        error: 'Login failed'
      }))
      return false
    }
  }

  const logout = async (): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/auth', {
        method: 'DELETE',
        credentials: 'include'
      })
      
      const data = await response.json()
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          isAdminMode: false,
          error: null
        }))
        return true
      }
      
      return false
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: 'Logout failed'
      }))
      return false
    }
  }

  useEffect(() => {
    checkAdminStatus()
  }, [])

  return {
    ...state,
    login,
    logout,
    refresh: checkAdminStatus
  }
}