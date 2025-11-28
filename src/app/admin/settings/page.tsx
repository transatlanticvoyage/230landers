'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdminAuth } from '../../../contexts/AdminAuthContext'
import AnalyticsDashboard from '../../../components/AnalyticsDashboard'

export default function AdminSettingsPage() {
  const { 
    isAuthenticated, 
    user, 
    isLoading, 
    logout, 
    config, 
    isDevModeEnabled,
    toggleDevMode,
    updateConfig,
    refreshConfig
  } = useAdminAuth()

  const router = useRouter()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const [isUpdating, setIsUpdating] = useState(false)
  const [activeTab, setActiveTab] = useState('system')

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, isLoading, router])

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 5000)
  }

  const handleLogout = async () => {
    await logout()
    router.push('/admin/login')
  }

  const handleDevModeToggle = async () => {
    setIsUpdating(true)
    const result = await toggleDevMode()
    
    if (result.success) {
      showMessage('success', result.message)
    } else {
      showMessage('error', result.message)
    }
    setIsUpdating(false)
  }

  const handleConfigUpdate = async (key: string, value: any) => {
    setIsUpdating(true)
    const result = await updateConfig({ [key]: value })
    
    if (result.success) {
      showMessage('success', `Updated ${key}`)
    } else {
      showMessage('error', result.message)
    }
    setIsUpdating(false)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Will redirect
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                🐍 <span className="ml-2">Viper Admin</span>
              </h1>
              <p className="text-gray-600 mt-1">Landing Page Management System</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">{user?.email}</div>
                <div className="text-xs text-gray-500 capitalize">{user?.role} Access</div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Success/Error Message */}
        {message && (
          <div className={`mb-6 p-4 rounded-lg border ${
            message.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : 'bg-red-50 border-red-200 text-red-800'
          }`}>
            <div className="flex items-center">
              <span className="mr-2">
                {message.type === 'success' ? '✅' : '⚠️'}
              </span>
              {message.text}
            </div>
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="bg-white rounded-xl shadow-sm border mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8 px-6">
              {[
                { id: 'system', label: 'System Settings', icon: '⚙️' },
                { id: 'analytics', label: 'Analytics', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'system' && (
          <>
            {/* System Status */}
            <div className="bg-white rounded-xl shadow-sm border p-6 mb-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                📊 <span className="ml-2">System Status</span>
              </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-blue-600">
                {isDevModeEnabled ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-gray-600">Dev Mode</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-green-600">
                {config?.ip_check_enabled?.value ? 'ON' : 'OFF'}
              </div>
              <div className="text-sm text-gray-600">IP Checking</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-purple-600">
                {Math.floor((config?.session_timeout_seconds?.value || 28800) / 3600)}h
              </div>
              <div className="text-sm text-gray-600">Session Timeout</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <div className="text-2xl font-bold text-indigo-600">
                {config?.max_login_attempts?.value || 5}
              </div>
              <div className="text-sm text-gray-600">Max Login Attempts</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Development Settings */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              🛠️ <span className="ml-2">Development Settings</span>
            </h2>

            <div className="space-y-6">
              {/* Dev Mode Toggle */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h3 className="font-semibold text-gray-900">Development Mode</h3>
                  <p className="text-sm text-gray-600">
                    Shows dev buttons and auto-fill features in checkout flows
                  </p>
                </div>
                <button
                  onClick={handleDevModeToggle}
                  disabled={isUpdating}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                    isDevModeEnabled ? 'bg-blue-600' : 'bg-gray-200'
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                      isDevModeEnabled ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>

              {/* Keyboard Shortcuts */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-semibold text-gray-900 mb-3">Keyboard Shortcuts</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto-submit Step 1:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded text-xs">Alt+Shift+1</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto-submit Step 2:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded text-xs">Alt+Shift+2</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Auto-submit Step 3:</span>
                    <span className="font-mono bg-white px-2 py-1 rounded text-xs">Alt+Shift+3</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Landing Pages */}
          <div className="bg-white rounded-xl shadow-sm border p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
              🚀 <span className="ml-2">Landing Pages</span>
            </h2>

            <div className="space-y-4">
              {[
                {
                  name: 'Maps Booster Deluxe',
                  url: '/maps-booster-deluxe',
                  description: 'Google Business Profile optimization service',
                  color: 'from-blue-600 to-blue-800'
                },
                {
                  name: 'Tregnar',
                  url: '/tregnar',
                  description: 'SaaS platform for website portfolio management',
                  color: 'from-indigo-600 to-purple-600'
                },
                {
                  name: 'MoonTracker',
                  url: '/ranktracker',
                  description: 'Advanced SEO rank tracking software',
                  color: 'from-purple-600 to-indigo-600'
                }
              ].map((page) => (
                <div key={page.name} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{page.name}</h3>
                      <p className="text-sm text-gray-600">{page.description}</p>
                    </div>
                    <div className="flex space-x-2">
                      <a
                        href={page.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                      >
                        View Page →
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>💡 Pro Tip:</strong> When dev mode is enabled, you'll see special admin buttons 
                on each landing page that allow auto-filling and testing checkout flows.
              </p>
            </div>
          </div>
        </div>

        {/* System Information */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
            🔧 <span className="ml-2">System Information</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">{user?.email}</div>
              <div className="text-sm text-gray-600">Current User</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 capitalize">{user?.role}</div>
              <div className="text-sm text-gray-600">Access Level</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {Object.keys(config || {}).length}
              </div>
              <div className="text-sm text-gray-600">Config Settings</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">Online</div>
              <div className="text-sm text-gray-600">System Status</div>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={refreshConfig}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors text-sm"
            >
              🔄 Refresh Configuration
            </button>
          </div>
        </div>
          </>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard />
        )}
      </main>
    </div>
  )
}