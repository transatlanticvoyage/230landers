-- Viper System Database Schema
-- Landing Page Admin System for offers.leadtrain.net
-- Created for the 230landers React/Next.js system

-- 1. Admin Users Table
CREATE TABLE viper_admin_users (
  admin_user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role TEXT DEFAULT 'admin' NOT NULL CHECK (role IN ('admin', 'super_admin')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login_at TIMESTAMPTZ,
  login_count INTEGER DEFAULT 0,
  failed_login_attempts INTEGER DEFAULT 0,
  last_failed_attempt_at TIMESTAMPTZ,
  password_changed_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT
);

-- 2. Admin Sessions Table
CREATE TABLE viper_admin_sessions (
  session_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES viper_admin_users(admin_user_id) ON DELETE CASCADE,
  session_token TEXT UNIQUE NOT NULL,
  refresh_token TEXT UNIQUE,
  ip_address INET NOT NULL,
  user_agent TEXT,
  expires_at TIMESTAMPTZ NOT NULL,
  refresh_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true,
  logout_reason TEXT -- 'manual', 'timeout', 'revoked', 'ip_mismatch'
);

-- 3. System Configuration Table
CREATE TABLE viper_config (
  config_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  config_key TEXT UNIQUE NOT NULL,
  config_value JSONB NOT NULL,
  data_type TEXT NOT NULL CHECK (data_type IN ('boolean', 'string', 'number', 'array', 'object')),
  description TEXT,
  is_sensitive BOOLEAN DEFAULT false,
  environment TEXT DEFAULT 'all' CHECK (environment IN ('development', 'production', 'staging', 'all')),
  updated_by UUID REFERENCES viper_admin_users(admin_user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. IP Whitelist Table
CREATE TABLE viper_allowed_ips (
  ip_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  ip_address INET NOT NULL UNIQUE,
  ip_range CIDR, -- For subnet ranges like 192.168.1.0/24
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  added_by UUID REFERENCES viper_admin_users(admin_user_id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_used_at TIMESTAMPTZ,
  usage_count INTEGER DEFAULT 0
);

-- 5. Admin Audit Log
CREATE TABLE viper_admin_audit_log (
  log_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES viper_admin_users(admin_user_id),
  session_id UUID REFERENCES viper_admin_sessions(session_id),
  action_type TEXT NOT NULL, -- 'login', 'logout', 'config_update', 'dev_mode_toggle', etc.
  action_category TEXT NOT NULL CHECK (action_category IN ('auth', 'config', 'dev_mode', 'security', 'system')),
  target_resource TEXT, -- Table name or resource affected
  target_id TEXT, -- ID of the affected record
  old_values JSONB, -- Previous values (for updates)
  new_values JSONB, -- New values (for updates)
  action_result TEXT CHECK (action_result IN ('success', 'failure', 'error')),
  error_message TEXT,
  ip_address INET,
  user_agent TEXT,
  request_path TEXT,
  request_method TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Dev Mode Action Log
CREATE TABLE viper_dev_actions (
  action_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES viper_admin_users(admin_user_id),
  session_id UUID REFERENCES viper_admin_sessions(session_id),
  page_name TEXT NOT NULL, -- 'maps-booster-deluxe', 'tregnar', 'ranktracker'
  action_type TEXT NOT NULL, -- 'autofill', 'autosubmit', 'keyboard_shortcut', 'manual_dev_button'
  step_number INTEGER,
  step_name TEXT,
  form_data JSONB, -- The data that was auto-filled
  execution_time_ms INTEGER, -- How long the action took
  success BOOLEAN DEFAULT true,
  error_message TEXT,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Landing Page Analytics
CREATE TABLE viper_page_analytics (
  analytics_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  page_name TEXT NOT NULL,
  visitor_ip INET,
  user_agent TEXT,
  referrer TEXT,
  dev_mode_active BOOLEAN DEFAULT false,
  session_duration INTEGER, -- in seconds
  checkout_started BOOLEAN DEFAULT false,
  checkout_completed BOOLEAN DEFAULT false,
  checkout_step_reached INTEGER,
  conversion_value DECIMAL(10,2),
  promo_code_used TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- 8. System Health Monitoring
CREATE TABLE viper_system_health (
  health_id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(15,6),
  metric_unit TEXT,
  status TEXT CHECK (status IN ('healthy', 'warning', 'critical')),
  details JSONB,
  recorded_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Performance
CREATE INDEX idx_viper_admin_users_email ON viper_admin_users(email);
CREATE INDEX idx_viper_admin_users_active ON viper_admin_users(is_active) WHERE is_active = true;

CREATE INDEX idx_viper_admin_sessions_token ON viper_admin_sessions(session_token);
CREATE INDEX idx_viper_admin_sessions_user_active ON viper_admin_sessions(user_id, is_active) WHERE is_active = true;
CREATE INDEX idx_viper_admin_sessions_expires ON viper_admin_sessions(expires_at);

CREATE INDEX idx_viper_config_key ON viper_config(config_key);
CREATE INDEX idx_viper_config_environment ON viper_config(environment);

CREATE INDEX idx_viper_allowed_ips_address ON viper_allowed_ips(ip_address) WHERE is_active = true;

CREATE INDEX idx_viper_audit_log_user_time ON viper_admin_audit_log(user_id, created_at);
CREATE INDEX idx_viper_audit_log_action ON viper_admin_audit_log(action_type, created_at);
CREATE INDEX idx_viper_audit_log_category ON viper_admin_audit_log(action_category);

CREATE INDEX idx_viper_dev_actions_user_page ON viper_dev_actions(user_id, page_name, created_at);
CREATE INDEX idx_viper_dev_actions_type ON viper_dev_actions(action_type, created_at);

CREATE INDEX idx_viper_analytics_page_time ON viper_page_analytics(page_name, created_at);
CREATE INDEX idx_viper_analytics_conversion ON viper_page_analytics(checkout_completed, created_at);

CREATE INDEX idx_viper_health_metric_time ON viper_system_health(metric_name, recorded_at);

-- Row Level Security Policies (Disabled for Development)
-- TODO: Enable RLS and create policies before production deployment
-- ALTER TABLE viper_admin_users ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE viper_admin_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE viper_config ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE viper_allowed_ips ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE viper_admin_audit_log ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE viper_dev_actions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE viper_page_analytics ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE viper_system_health ENABLE ROW LEVEL SECURITY;

-- Initial Configuration Data
INSERT INTO viper_config (config_key, config_value, data_type, description, environment) VALUES
('dev_mode_enabled', 'true', 'boolean', 'Enable development mode features across all landing pages', 'development'),
('ip_check_enabled', 'false', 'boolean', 'Require IP address to be whitelisted for admin access', 'all'),
('session_timeout_seconds', '28800', 'number', 'Admin session timeout in seconds (8 hours)', 'all'),
('max_login_attempts', '5', 'number', 'Maximum failed login attempts before lockout', 'all'),
('lockout_duration_minutes', '60', 'number', 'Account lockout duration in minutes', 'all'),
('auto_logout_warning_minutes', '5', 'number', 'Show logout warning X minutes before session expires', 'all'),
('dev_keyboard_shortcuts_enabled', 'true', 'boolean', 'Enable Alt+Shift keyboard shortcuts in dev mode', 'development'),
('audit_log_retention_days', '90', 'number', 'How long to keep audit logs', 'all'),
('dev_action_log_retention_days', '30', 'number', 'How long to keep dev action logs', 'development'),
('page_analytics_retention_days', '365', 'number', 'How long to keep page analytics', 'all');

-- Initial Admin User (password: 'sprinkle' hashed with bcrypt)
-- Note: This should be changed in production
INSERT INTO viper_admin_users (email, password_hash, role) VALUES
('admin_for_viper_system@kozomail.com', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBdXfs2Tv9/4nO', 'super_admin');

-- Initial IP Whitelist (should be updated with actual IPs)
INSERT INTO viper_allowed_ips (ip_address, description, added_by) VALUES
('127.0.0.1', 'Localhost for development', (SELECT admin_user_id FROM viper_admin_users WHERE email = 'admin_for_viper_system@kozomail.com')),
('::1', 'IPv6 localhost for development', (SELECT admin_user_id FROM viper_admin_users WHERE email = 'admin_for_viper_system@kozomail.com'));

-- Comments for documentation
COMMENT ON TABLE viper_admin_users IS 'Admin users who can access the Viper landing page management system';
COMMENT ON TABLE viper_admin_sessions IS 'Active admin sessions with token validation';
COMMENT ON TABLE viper_config IS 'System configuration settings for the Viper system';
COMMENT ON TABLE viper_allowed_ips IS 'IP addresses allowed to access admin features';
COMMENT ON TABLE viper_admin_audit_log IS 'Audit trail of all admin actions';
COMMENT ON TABLE viper_dev_actions IS 'Log of development mode feature usage';
COMMENT ON TABLE viper_page_analytics IS 'Analytics data for landing page performance';
COMMENT ON TABLE viper_system_health IS 'System health metrics and monitoring data';

-- Functions for common operations
CREATE OR REPLACE FUNCTION viper_log_admin_action(
  p_user_id UUID,
  p_session_id UUID,
  p_action_type TEXT,
  p_action_category TEXT,
  p_target_resource TEXT DEFAULT NULL,
  p_target_id TEXT DEFAULT NULL,
  p_old_values JSONB DEFAULT NULL,
  p_new_values JSONB DEFAULT NULL,
  p_action_result TEXT DEFAULT 'success',
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
  log_id UUID;
BEGIN
  INSERT INTO viper_admin_audit_log (
    user_id, session_id, action_type, action_category, target_resource, 
    target_id, old_values, new_values, action_result, error_message,
    ip_address, user_agent, request_path, request_method
  ) VALUES (
    p_user_id, p_session_id, p_action_type, p_action_category, p_target_resource,
    p_target_id, p_old_values, p_new_values, p_action_result, p_error_message,
    inet_client_addr(), current_setting('request.headers.user-agent', true),
    current_setting('request.path', true), current_setting('request.method', true)
  ) RETURNING log_id INTO log_id;
  
  RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Cleanup function for old logs
CREATE OR REPLACE FUNCTION viper_cleanup_old_logs()
RETURNS INTEGER AS $$
DECLARE
  deleted_count INTEGER := 0;
  audit_retention_days INTEGER;
  dev_retention_days INTEGER;
  analytics_retention_days INTEGER;
BEGIN
  -- Get retention periods from config
  SELECT (config_value->>'audit_log_retention_days')::INTEGER INTO audit_retention_days
  FROM viper_config WHERE config_key = 'audit_log_retention_days';
  
  SELECT (config_value->>'dev_action_log_retention_days')::INTEGER INTO dev_retention_days
  FROM viper_config WHERE config_key = 'dev_action_log_retention_days';
  
  SELECT (config_value->>'page_analytics_retention_days')::INTEGER INTO analytics_retention_days
  FROM viper_config WHERE config_key = 'page_analytics_retention_days';
  
  -- Clean up audit logs
  DELETE FROM viper_admin_audit_log 
  WHERE created_at < NOW() - INTERVAL '1 day' * COALESCE(audit_retention_days, 90);
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  -- Clean up dev action logs
  DELETE FROM viper_dev_actions 
  WHERE created_at < NOW() - INTERVAL '1 day' * COALESCE(dev_retention_days, 30);
  
  -- Clean up analytics logs
  DELETE FROM viper_page_analytics 
  WHERE created_at < NOW() - INTERVAL '1 day' * COALESCE(analytics_retention_days, 365);
  
  -- Clean up inactive sessions
  DELETE FROM viper_admin_sessions 
  WHERE expires_at < NOW() OR (is_active = false AND created_at < NOW() - INTERVAL '7 days');
  
  RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;