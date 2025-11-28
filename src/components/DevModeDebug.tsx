'use client'

import { useAdminAuth, useDevFeatures } from '../contexts/AdminAuthContext'

export default function DevModeDebug() {
  const { isAuthenticated, user, isLoading, isDevModeEnabled, config, forceRefresh } = useAdminAuth()
  const { showDevButtons, canAutoFill } = useDevFeatures()

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 left-4 bg-black/80 text-white p-4 rounded-lg text-xs max-w-sm z-50">
      <div className="font-bold mb-2">🐍 Viper Debug Panel</div>
      <div>Loading: {isLoading ? 'Yes' : 'No'}</div>
      <div>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</div>
      <div>User: {user?.email || 'None'}</div>
      <div>Role: {user?.role || 'None'}</div>
      <div>Dev Mode Config: {isDevModeEnabled ? 'Enabled' : 'Disabled'}</div>
      <div>Show Dev Buttons: {showDevButtons ? 'Yes' : 'No'}</div>
      <div>Can Auto-Fill: {canAutoFill ? 'Yes' : 'No'}</div>
      <div>Config Keys: {config ? Object.keys(config).length : 0}</div>
      
      <div className="mt-2 pt-2 border-t border-gray-600 space-y-1">
        <button 
          onClick={async () => {
            const response = await fetch('/api/viper/auth', { 
              method: 'GET', 
              credentials: 'include' 
            })
            const data = await response.json()
            console.log('Auth check result:', data)
          }}
          className="bg-blue-500 hover:bg-blue-600 px-2 py-1 rounded text-xs block w-full"
        >
          Test Auth API
        </button>
        <button 
          onClick={forceRefresh}
          className="bg-green-500 hover:bg-green-600 px-2 py-1 rounded text-xs block w-full"
        >
          Force Refresh
        </button>
      </div>
    </div>
  )
}