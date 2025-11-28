'use client'

import { useState, useEffect } from 'react'
import { useAdminMode } from '../hooks/useAdminMode'

interface AdminDevPanelProps {
  pageName: string
  devActions?: Array<{
    label: string
    action: () => void
    variant?: 'primary' | 'success' | 'warning' | 'danger'
  }>
}

export default function AdminDevPanel({ pageName, devActions = [] }: AdminDevPanelProps) {
  const { isAdminMode, isAdminModeEnabled, login, logout } = useAdminMode()
  const [isVisible, setIsVisible] = useState(false)
  const [showLoginForm, setShowLoginForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Don't render if admin mode is not enabled in environment
  if (!isAdminModeEnabled) {
    return null
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoggingIn(true)
    
    const success = await login(email, password)
    if (success) {
      setShowLoginForm(false)
      setEmail('')
      setPassword('')
    }
    
    setIsLoggingIn(false)
  }

  const handleLogout = async () => {
    await logout()
  }

  const getVariantClasses = (variant: string = 'primary') => {
    switch (variant) {
      case 'success': return 'bg-green-500 hover:bg-green-600'
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'danger': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-blue-500 hover:bg-blue-600'
    }
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="fixed bottom-5 right-5 w-12 h-12 bg-purple-600 hover:bg-purple-700 text-white rounded-full shadow-lg z-50 flex items-center justify-center transition-all"
        title="Toggle Admin Dev Panel"
      >
        🔧
      </button>

      {/* Admin Dev Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-5 bg-gray-900 text-white p-6 rounded-xl shadow-2xl z-50 min-w-[320px] max-w-[400px]">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg">🖥️ Dev Mode</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          {/* Page Info */}
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <div className="text-sm text-gray-300">Current Page:</div>
            <div className="font-semibold">{pageName}</div>
            <div className="text-xs text-gray-400 mt-1">
              Environment: {process.env.NODE_ENV || 'development'}
            </div>
          </div>

          {!isAdminMode ? (
            // Login Form
            <div>
              {!showLoginForm ? (
                <button
                  onClick={() => setShowLoginForm(true)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
                >
                  Admin Login
                </button>
              ) : (
                <form onSubmit={handleLogin} className="space-y-3">
                  <input
                    type="email"
                    placeholder="Admin Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    required
                  />
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
                    required
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isLoggingIn}
                      className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
                    >
                      {isLoggingIn ? 'Logging in...' : 'Login'}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setShowLoginForm(false)
                        setEmail('')
                        setPassword('')
                      }}
                      className="px-3 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            // Admin Controls
            <div className="space-y-4">
              {/* Admin Status */}
              <div className="bg-green-900 p-3 rounded-lg">
                <div className="flex items-center gap-2 text-green-300">
                  <span className="text-green-400">✓</span>
                  <span className="font-semibold">Admin Authenticated</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="mt-2 text-xs text-green-400 hover:text-green-300 underline"
                >
                  Logout
                </button>
              </div>

              {/* Page-Specific Dev Actions */}
              {devActions.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2 text-gray-300">Page Actions:</h4>
                  <div className="space-y-2">
                    {devActions.map((action, index) => (
                      <button
                        key={index}
                        onClick={action.action}
                        className={`w-full py-2 px-3 rounded-lg text-white text-sm font-medium transition-colors ${getVariantClasses(action.variant)}`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* General Dev Actions */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-300">Dev Tools:</h4>
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      console.clear()
                      console.log('🖥️ Console cleared by admin dev panel')
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                  >
                    Clear Console
                  </button>
                  <button
                    onClick={() => {
                      const state = {
                        page: pageName,
                        url: window.location.href,
                        timestamp: new Date().toISOString(),
                        userAgent: navigator.userAgent,
                        localStorage: localStorage,
                        sessionStorage: sessionStorage
                      }
                      console.log('🔍 Page State Debug:', state)
                    }}
                    className="w-full bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                  >
                    Debug Page State
                  </button>
                  <button
                    onClick={() => {
                      window.location.reload()
                    }}
                    className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg text-sm transition-colors"
                  >
                    Force Reload
                  </button>
                </div>
              </div>

              {/* Quick Links */}
              <div>
                <h4 className="font-semibold mb-2 text-gray-300">Quick Navigation:</h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <a href="/maps-booster-deluxe" className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-center transition-colors">
                    Maps Booster
                  </a>
                  <a href="/tregnar" className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-center transition-colors">
                    Tregnar
                  </a>
                  <a href="/ranktracker" className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-center transition-colors">
                    Ranktracker
                  </a>
                  <a href="/" className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-center transition-colors">
                    Home
                  </a>
                </div>
              </div>

              <div className="text-xs text-gray-500 pt-2 border-t border-gray-700">
                230landers dev environment<br/>
                Built with Next.js + React
              </div>
            </div>
          )}
        </div>
      )}
    </>
  )
}