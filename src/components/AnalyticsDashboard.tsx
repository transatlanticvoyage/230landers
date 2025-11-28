'use client'

// Test comment: Analytics dashboard component for Viper admin system
// Displays user session data, conversion funnels, and detailed analytics
// Location: moved to sheldon-containers for better organization
import { useState, useEffect } from 'react'

interface Session {
  session_id: string
  visitor_ip: string
  user_agent: string
  first_seen: string
  last_seen: string
  events: any[]
  steps_completed: number[]
  total_time_seconds: number
  conversion_status: 'converted' | 'abandoned'
  furthest_step: number
}

interface AnalyticsSummary {
  total_sessions: number
  converted_sessions: number
  conversion_rate: number
  step_analysis: {
    step_1_starts: number
    step_2_starts: number
    step_3_starts: number
    step_4_starts: number
    completions: number
  }
  date_range_days: number
}

interface AnalyticsData {
  summary: AnalyticsSummary
  sessions: Session[]
  raw_events: any[]
}

interface AnalyticsDashboardProps {
  pageName?: string
}

export default function AnalyticsDashboard({ pageName = 'MoonTracker' }: AnalyticsDashboardProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedDays, setSelectedDays] = useState(7)
  const [selectedSession, setSelectedSession] = useState<Session | null>(null)

  useEffect(() => {
    fetchAnalytics()
  }, [selectedDays, pageName])

  const fetchAnalytics = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/viper/analytics?page_name=${pageName}&days=${selectedDays}&limit=200`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setAnalyticsData(data)
      } else if (data.message === 'Analytics system not configured') {
        setAnalyticsData(null)
      }
    } catch (error) {
      console.error('Failed to fetch analytics:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const formatDuration = (seconds: number): string => {
    if (seconds < 60) return `${seconds}s`
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ${seconds % 60}s`
    return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`
  }

  const getStepDropoffRate = (step1: number, step2: number): number => {
    if (step1 === 0) return 0
    return Math.round(((step1 - step2) / step1) * 100)
  }

  const getDeviceInfo = (userAgent: string): string => {
    if (userAgent.includes('Mobile')) return '📱 Mobile'
    if (userAgent.includes('Tablet')) return '📱 Tablet'
    return '💻 Desktop'
  }

  const getBrowserInfo = (userAgent: string): string => {
    if (userAgent.includes('Chrome')) return '🌐 Chrome'
    if (userAgent.includes('Firefox')) return '🦊 Firefox'
    if (userAgent.includes('Safari')) return '🧭 Safari'
    if (userAgent.includes('Edge')) return '🔷 Edge'
    return '🌐 Other'
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <span className="ml-3 text-gray-600">Loading analytics...</span>
        </div>
      </div>
    )
  }

  if (!analyticsData) {
    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Analytics Dashboard</h3>
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-blue-800">
            <strong>ℹ️ Analytics System Setup Required</strong>
          </p>
          <p className="text-blue-700 mt-2">
            To enable analytics tracking, configure the following environment variables:
          </p>
          <ul className="text-sm text-blue-600 mt-2 ml-4">
            <li>• NEXT_PUBLIC_SUPABASE_URL</li>
            <li>• SUPABASE_SERVICE_ROLE_KEY</li>
            <li>• VIPER_JWT_SECRET</li>
          </ul>
          <p className="text-xs text-blue-600 mt-3">
            See VIPER_SETUP.md for complete setup instructions.
          </p>
        </div>
      </div>
    )
  }

  const { summary, sessions } = analyticsData

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-bold text-gray-900">📊 {pageName} Analytics</h3>
          <div className="flex items-center gap-3">
            <select
              value={selectedDays}
              onChange={(e) => setSelectedDays(parseInt(e.target.value))}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
            >
              <option value={1}>Last 24 hours</option>
              <option value={7}>Last 7 days</option>
              <option value={30}>Last 30 days</option>
              <option value={90}>Last 90 days</option>
            </select>
            <button
              onClick={fetchAnalytics}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{summary.total_sessions}</div>
            <div className="text-sm text-blue-800">Total Sessions</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">{summary.converted_sessions}</div>
            <div className="text-sm text-green-800">Conversions</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{summary.conversion_rate}%</div>
            <div className="text-sm text-purple-800">Conversion Rate</div>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">
              {sessions.length > 0 ? Math.round(sessions.reduce((acc, s) => acc + s.total_time_seconds, 0) / sessions.length) : 0}s
            </div>
            <div className="text-sm text-yellow-800">Avg. Session Time</div>
          </div>
        </div>
      </div>

      {/* Funnel Analysis */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="font-bold text-gray-900 mb-4">🔽 Checkout Funnel</h4>
        <div className="space-y-3">
          {[
            { step: 1, name: 'Plan Selection', count: summary.step_analysis.step_1_starts },
            { step: 2, name: 'Account Info', count: summary.step_analysis.step_2_starts },
            { step: 3, name: 'Payment Info', count: summary.step_analysis.step_3_starts },
            { step: 4, name: 'Confirmation', count: summary.step_analysis.step_4_starts },
            { step: 'complete', name: 'Completed', count: summary.step_analysis.completions }
          ].map((item, index, array) => {
            const percentage = summary.total_sessions > 0 
              ? Math.round((item.count / summary.total_sessions) * 100) 
              : 0
            const dropoff = index > 0 
              ? getStepDropoffRate(array[index - 1].count, item.count)
              : 0

            return (
              <div key={item.step} className="flex items-center gap-4">
                <div className="w-24 text-sm font-medium">
                  {item.step === 'complete' ? '✅' : `Step ${item.step}`}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm">{item.name}</span>
                    <span className="text-sm font-medium">{item.count} ({percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.step === 'complete' ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  {dropoff > 0 && (
                    <div className="text-xs text-red-600 mt-1">
                      -{dropoff}% dropoff from previous step
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Recent Sessions */}
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h4 className="font-bold text-gray-900 mb-4">👥 Recent User Sessions</h4>
        <div className="space-y-3">
          {sessions.slice(0, 10).map((session) => (
            <div
              key={session.session_id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 cursor-pointer"
              onClick={() => setSelectedSession(session)}
            >
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <span className={`w-3 h-3 rounded-full ${
                    session.conversion_status === 'converted' ? 'bg-green-500' : 'bg-red-500'
                  }`}></span>
                  <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                    {session.session_id.slice(-8)}
                  </span>
                  <span className="text-sm text-gray-600">
                    {getDeviceInfo(session.user_agent)} {getBrowserInfo(session.user_agent)}
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {new Date(session.first_seen).toLocaleString()}
                </div>
              </div>
              
              <div className="flex items-center gap-6 text-sm text-gray-600">
                <span>
                  <strong>Progress:</strong> Step {session.furthest_step}/4
                </span>
                <span>
                  <strong>Duration:</strong> {formatDuration(session.total_time_seconds)}
                </span>
                <span>
                  <strong>Events:</strong> {session.events.length}
                </span>
                <span className={`font-medium ${
                  session.conversion_status === 'converted' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {session.conversion_status === 'converted' ? '✅ Converted' : '❌ Abandoned'}
                </span>
              </div>
            </div>
          ))}
        </div>

        {sessions.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No sessions found for the selected time period.
          </div>
        )}
      </div>

      {/* Session Details Modal */}
      {selectedSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full mx-4 max-h-[80vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold">Session Details</h3>
                <button
                  onClick={() => setSelectedSession(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-6 overflow-y-auto max-h-[60vh]">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <h4 className="font-semibold mb-2">Session Info</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>ID:</strong> {selectedSession.session_id}</div>
                    <div><strong>IP:</strong> {selectedSession.visitor_ip}</div>
                    <div><strong>Device:</strong> {getDeviceInfo(selectedSession.user_agent)}</div>
                    <div><strong>Browser:</strong> {getBrowserInfo(selectedSession.user_agent)}</div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Progress</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Furthest Step:</strong> {selectedSession.furthest_step}/4</div>
                    <div><strong>Steps Completed:</strong> {selectedSession.steps_completed.join(', ') || 'None'}</div>
                    <div><strong>Status:</strong> <span className={
                      selectedSession.conversion_status === 'converted' ? 'text-green-600' : 'text-red-600'
                    }>{selectedSession.conversion_status}</span></div>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Timing</h4>
                  <div className="space-y-1 text-sm">
                    <div><strong>Started:</strong> {new Date(selectedSession.first_seen).toLocaleString()}</div>
                    <div><strong>Last Activity:</strong> {new Date(selectedSession.last_seen).toLocaleString()}</div>
                    <div><strong>Total Time:</strong> {formatDuration(selectedSession.total_time_seconds)}</div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-3">Event Timeline</h4>
                <div className="space-y-2">
                  {selectedSession.events.map((event, index) => (
                    <div key={index} className="border-l-4 border-blue-200 pl-4 py-2 bg-gray-50 rounded-r">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-medium text-sm">
                            {event.event_type} 
                            {event.step_number && ` - Step ${event.step_number}`}
                            {event.step_name && ` (${event.step_name})`}
                          </div>
                          {event.form_data && (
                            <div className="text-xs text-gray-600 mt-1">
                              Data: {JSON.stringify(event.form_data, null, 2).slice(0, 100)}...
                            </div>
                          )}
                          {event.error_message && (
                            <div className="text-xs text-red-600 mt-1">
                              Error: {event.error_message}
                            </div>
                          )}
                        </div>
                        <div className="text-xs text-gray-500">
                          {new Date(event.created_at).toLocaleTimeString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}