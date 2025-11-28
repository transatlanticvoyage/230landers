'use client'

import { useState, useEffect } from 'react'
import { useDevFeatures, useAdminAuth } from '../contexts/AdminAuthContext'

interface DevAction {
  label: string
  action: () => void | Promise<void>
  variant?: 'primary' | 'success' | 'warning' | 'danger'
  description?: string
}

interface ViperDevPanelProps {
  pageName: string
  devActions?: DevAction[]
}

export default function ViperDevPanel({ pageName, devActions = [] }: ViperDevPanelProps) {
  const { showDevButtons, canAutoFill, canUseShortcuts, isAdmin } = useDevFeatures()
  const { user, logout, isDevModeEnabled, config } = useAdminAuth()
  const [isVisible, setIsVisible] = useState(false)
  const [isExecuting, setIsExecuting] = useState<number | null>(null)
  const [executionLog, setExecutionLog] = useState<Array<{ 
    timestamp: string
    action: string
    success: boolean
    duration?: number
  }>>([])

  // Keyboard shortcuts
  useEffect(() => {
    if (!canUseShortcuts) return

    const handleKeyboard = (event: KeyboardEvent) => {
      if (event.altKey && event.shiftKey) {
        event.preventDefault()
        
        switch (event.key) {
          case '1':
            if (devActions[0]) executeAction(0, devActions[0])
            break
          case '2':
            if (devActions[1]) executeAction(1, devActions[1])
            break
          case '3':
            if (devActions[2]) executeAction(2, devActions[2])
            break
          case 'D':
          case 'd':
            setIsVisible(!isVisible)
            break
        }
      }
    }

    window.addEventListener('keydown', handleKeyboard)
    return () => window.removeEventListener('keydown', handleKeyboard)
  }, [canUseShortcuts, devActions, isVisible])

  const executeAction = async (index: number, action: DevAction) => {
    if (isExecuting !== null) return

    setIsExecuting(index)
    const startTime = Date.now()
    
    try {
      await action.action()
      const duration = Date.now() - startTime
      
      // Log the successful action
      logDevAction(action.label, true, duration)
      
      console.log(`✅ Dev Action: ${action.label} (${duration}ms)`)
    } catch (error) {
      const duration = Date.now() - startTime
      
      // Log the failed action
      logDevAction(action.label, false, duration)
      
      console.error(`❌ Dev Action Failed: ${action.label}`, error)
    } finally {
      setIsExecuting(null)
    }
  }

  const logDevAction = (actionName: string, success: boolean, duration: number) => {
    const logEntry = {
      timestamp: new Date().toLocaleTimeString(),
      action: actionName,
      success,
      duration
    }
    
    setExecutionLog(prev => [logEntry, ...prev.slice(0, 9)]) // Keep last 10 entries

    // Send to Viper system for tracking
    if (isAdmin) {
      fetch('/api/viper/dev-action', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_name: pageName,
          action_type: 'manual_dev_button',
          action_name: actionName,
          success,
          execution_time_ms: duration
        })
      }).catch(console.error)
    }
  }

  const getVariantClasses = (variant: string = 'primary') => {
    switch (variant) {
      case 'success': return 'bg-green-500 hover:bg-green-600'
      case 'warning': return 'bg-yellow-500 hover:bg-yellow-600'
      case 'danger': return 'bg-red-500 hover:bg-red-600'
      default: return 'bg-blue-500 hover:bg-blue-600'
    }
  }

  // Don't render if user doesn't have dev features enabled
  if (!showDevButtons && !isAdmin) {
    return null
  }

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={() => setIsVisible(!isVisible)}
        className={`fixed bottom-5 right-5 w-12 h-12 text-white rounded-full shadow-lg z-50 flex items-center justify-center transition-all ${
          isAdmin ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400 cursor-not-allowed'
        }`}
        title={showDevButtons ? "Viper Dev Panel (Alt+Shift+D)" : "Dev mode disabled"}
      >
        🐍
      </button>

      {/* Viper Dev Panel */}
      {isVisible && (
        <div className="fixed bottom-20 right-5 bg-gray-900 text-white p-6 rounded-xl shadow-2xl z-50 min-w-[380px] max-w-[450px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-lg flex items-center">
              🐍 <span className="ml-2">Viper Dev</span>
            </h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-400 hover:text-white text-xl"
            >
              ×
            </button>
          </div>

          {/* Status */}
          <div className="bg-gray-800 p-3 rounded-lg mb-4">
            <div className="flex justify-between items-center mb-2">
              <div className="text-sm text-gray-300">Status:</div>
              <div className={`text-xs px-2 py-1 rounded-full ${
                showDevButtons ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
              }`}>
                {showDevButtons ? 'Dev Mode ON' : 'Dev Mode OFF'}
              </div>
            </div>
            <div className="text-sm">
              <div className="text-gray-300">Page: <span className="text-white">{pageName}</span></div>
              <div className="text-gray-300">User: <span className="text-white">{user?.email}</span></div>
              {canUseShortcuts && (
                <div className="text-xs text-gray-400 mt-1">⌨️ Shortcuts enabled</div>
              )}
            </div>
          </div>

          {showDevButtons ? (
            <>
              {/* Page Actions */}
              {devActions.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-3 text-gray-300 flex items-center">
                    ⚡ Page Actions
                    {canUseShortcuts && (
                      <span className="text-xs text-gray-500 ml-2">(Alt+Shift+1/2/3)</span>
                    )}
                  </h4>
                  <div className="space-y-2">
                    {devActions.map((action, index) => (
                      <div key={index} className="relative">
                        <button
                          onClick={() => executeAction(index, action)}
                          disabled={isExecuting !== null}
                          className={`w-full py-2 px-3 rounded-lg text-white text-sm font-medium transition-all disabled:opacity-50 ${
                            getVariantClasses(action.variant)
                          } ${isExecuting === index ? 'scale-95' : 'hover:scale-[1.02]'}`}
                        >
                          <div className="flex items-center justify-between">
                            <span>{action.label}</span>
                            <div className="flex items-center space-x-1">
                              {canUseShortcuts && index < 3 && (
                                <span className="text-xs opacity-75">Alt+Shift+{index + 1}</span>
                              )}
                              {isExecuting === index && (
                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                              )}
                            </div>
                          </div>
                        </button>
                        {action.description && (
                          <div className="text-xs text-gray-400 mt-1 px-3">
                            {action.description}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Execution Log */}
              {executionLog.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-semibold mb-2 text-gray-300 flex items-center">
                    📋 <span className="ml-1">Recent Actions</span>
                  </h4>
                  <div className="bg-gray-800 rounded-lg p-2 max-h-32 overflow-y-auto">
                    {executionLog.slice(0, 5).map((log, index) => (
                      <div key={index} className="flex items-center justify-between text-xs py-1">
                        <span className={log.success ? 'text-green-400' : 'text-red-400'}>
                          {log.success ? '✓' : '✗'} {log.action}
                        </span>
                        <div className="text-gray-400 flex items-center space-x-1">
                          {log.duration && <span>{log.duration}ms</span>}
                          <span>{log.timestamp}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* System Tools */}
              <div className="mb-4">
                <h4 className="font-semibold mb-2 text-gray-300">🛠️ System Tools</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      console.clear()
                      console.log('🐍 Viper: Console cleared')
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-xs transition-colors"
                  >
                    Clear Console
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-orange-600 hover:bg-orange-700 text-white py-2 px-3 rounded-lg text-xs transition-colors"
                  >
                    Reload Page
                  </button>
                  <button
                    onClick={() => {
                      const state = {
                        page: pageName,
                        devMode: isDevModeEnabled,
                        user: user?.email,
                        url: window.location.href,
                        timestamp: new Date().toISOString()
                      }
                      console.log('🐍 Viper State:', state)
                    }}
                    className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-3 rounded-lg text-xs transition-colors"
                  >
                    Debug State
                  </button>
                  <a
                    href="/admin/settings"
                    target="_blank"
                    className="bg-purple-700 hover:bg-purple-600 text-white py-2 px-3 rounded-lg text-xs transition-colors text-center"
                  >
                    Admin Panel
                  </a>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-6">
              <div className="text-gray-400 mb-3">🔒</div>
              <p className="text-gray-400 text-sm mb-3">
                Dev mode is disabled or you don't have access.
              </p>
              <a
                href="/admin/login"
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm transition-colors"
              >
                Admin Login
              </a>
            </div>
          )}

          {/* Quick Navigation */}
          <div className="border-t border-gray-700 pt-3">
            <h4 className="font-semibold mb-2 text-gray-300 text-sm">🚀 Quick Nav</h4>
            <div className="grid grid-cols-2 gap-1 text-xs">
              <a href="/maps-booster-deluxe" className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-center transition-colors">
                Maps Booster
              </a>
              <a href="/tregnar" className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-center transition-colors">
                Tregnar
              </a>
              <a href="/ranktracker" className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-center transition-colors">
                MoonTracker
              </a>
              <a href="/" className="bg-gray-700 hover:bg-gray-600 p-2 rounded text-center transition-colors">
                Home
              </a>
            </div>
          </div>

          {/* Footer */}
          <div className="text-xs text-gray-500 pt-3 border-t border-gray-700 mt-3">
            <div className="flex justify-between items-center">
              <span>Viper System v1.0</span>
              {isAdmin && (
                <button
                  onClick={logout}
                  className="text-gray-400 hover:text-gray-300 underline"
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}