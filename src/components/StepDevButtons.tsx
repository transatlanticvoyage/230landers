'use client'

import { useDevFeatures } from '../contexts/AdminAuthContext'

interface StepDevButtonsProps {
  stepNumber: number
  stepName: string
  pageName: string
  onAutoFill?: () => void
  onAutoSubmit?: () => Promise<void> | void
  autoFillLabel?: string
  autoSubmitLabel?: string
  showSubmitButton?: boolean
}

export default function StepDevButtons({
  stepNumber,
  stepName,
  pageName,
  onAutoFill,
  onAutoSubmit,
  autoFillLabel = `Auto-Fill Step ${stepNumber}`,
  autoSubmitLabel = `Submit Step ${stepNumber}`,
  showSubmitButton = true
}: StepDevButtonsProps) {
  const { showDevButtons } = useDevFeatures()

  // Don't render if dev mode is disabled
  if (!showDevButtons) {
    return null
  }

  const handleAutoSubmit = async () => {
    if (onAutoFill) {
      onAutoFill()
    }
    
    // Wait a moment for state to update
    await new Promise(resolve => setTimeout(resolve, 100))
    
    if (onAutoSubmit) {
      await onAutoSubmit()
    }

    // Log the dev action
    try {
      await fetch('/api/viper/dev-action', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_name: pageName,
          action_type: 'autosubmit',
          step_number: stepNumber,
          step_name: stepName,
          success: true,
          execution_time_ms: 100
        })
      })
    } catch (error) {
      console.error('Failed to log dev action:', error)
    }
  }

  const handleAutoFill = async () => {
    if (onAutoFill) {
      onAutoFill()
    }

    // Log the dev action
    try {
      await fetch('/api/viper/dev-action', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          page_name: pageName,
          action_type: 'autofill',
          step_number: stepNumber,
          step_name: stepName,
          success: true,
          execution_time_ms: 50
        })
      })
    } catch (error) {
      console.error('Failed to log dev action:', error)
    }
  }

  return (
    <div className="border-2 border-purple-300 bg-purple-50 p-4 rounded-lg mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-purple-700 font-bold">🐍 Viper Dev</span>
          <span className="text-sm text-purple-600">Step {stepNumber}: {stepName}</span>
        </div>
        <div className="text-xs text-purple-500 bg-purple-200 px-2 py-1 rounded-full">
          Admin Mode
        </div>
      </div>
      
      <div className="flex gap-2">
        {onAutoFill && (
          <button
            onClick={handleAutoFill}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {autoFillLabel}
          </button>
        )}
        
        {showSubmitButton && onAutoSubmit && (
          <button
            onClick={handleAutoSubmit}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            {autoSubmitLabel}
          </button>
        )}
      </div>
      
      <div className="text-xs text-purple-600 mt-2">
        💡 Development mode active - these buttons are only visible to authenticated admins
      </div>
    </div>
  )
}