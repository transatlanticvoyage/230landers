-- Update Viper Page Analytics Table for Enhanced Tracking
-- Run this SQL to add new columns for detailed analytics

-- Add new columns to existing viper_page_analytics table
ALTER TABLE viper_page_analytics 
ADD COLUMN IF NOT EXISTS event_type TEXT,
ADD COLUMN IF NOT EXISTS step_number INTEGER,
ADD COLUMN IF NOT EXISTS step_name TEXT,
ADD COLUMN IF NOT EXISTS form_data JSONB,
ADD COLUMN IF NOT EXISTS time_spent_seconds INTEGER,
ADD COLUMN IF NOT EXISTS error_message TEXT,
ADD COLUMN IF NOT EXISTS visitor_session_id TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT;

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_viper_analytics_session ON viper_page_analytics(visitor_session_id);
CREATE INDEX IF NOT EXISTS idx_viper_analytics_event_type ON viper_page_analytics(event_type);
CREATE INDEX IF NOT EXISTS idx_viper_analytics_step ON viper_page_analytics(step_number);
CREATE INDEX IF NOT EXISTS idx_viper_analytics_page_created ON viper_page_analytics(page_name, created_at);

-- Add comments for documentation
COMMENT ON COLUMN viper_page_analytics.event_type IS 'Type of user interaction: page_load, step_start, step_complete, form_interaction, checkout_open, checkout_abandon, payment_attempt, payment_complete';
COMMENT ON COLUMN viper_page_analytics.step_number IS 'Checkout step number (1-4 for ranktracker)';
COMMENT ON COLUMN viper_page_analytics.step_name IS 'Human readable step name';
COMMENT ON COLUMN viper_page_analytics.form_data IS 'Captured form data (sanitized)';
COMMENT ON COLUMN viper_page_analytics.time_spent_seconds IS 'Time spent on this step in seconds';
COMMENT ON COLUMN viper_page_analytics.visitor_session_id IS 'Unique session identifier to track user journey';

-- Example of how to query user journey data
/*
-- Get all sessions with their progression
SELECT 
  visitor_session_id,
  visitor_ip,
  COUNT(*) as total_events,
  MAX(step_number) as furthest_step,
  MIN(created_at) as session_start,
  MAX(created_at) as session_end,
  SUM(time_spent_seconds) as total_time_seconds,
  CASE 
    WHEN MAX(event_type) = 'payment_complete' THEN 'converted'
    ELSE 'abandoned'
  END as status
FROM viper_page_analytics
WHERE page_name = 'MoonTracker'
  AND created_at >= NOW() - INTERVAL '7 days'
GROUP BY visitor_session_id, visitor_ip
ORDER BY session_start DESC;
*/