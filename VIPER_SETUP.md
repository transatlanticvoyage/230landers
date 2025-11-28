# 🐍 Viper System Setup Guide

The Viper System is now implemented for the 230landers React/Next.js landing pages. This guide will help you complete the setup.

## 📋 Setup Checklist

### 1. Database Setup ✅
- [x] Viper tables created in Supabase
- [x] Initial admin user and configuration inserted

### 2. Environment Variables (Required)

Create a `.env.local` file in the 230landers directory with:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Viper System Security
VIPER_JWT_SECRET=your_jwt_secret_key_here_minimum_32_characters

# Development Configuration
NODE_ENV=development
```

### 3. Install Dependencies

```bash
cd 230landers
npm install
```

This will install:
- `@supabase/supabase-js` - Supabase client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT tokens for sessions
- Type definitions for all packages

### 4. Start Development Server

```bash
npm run dev
```

## 🚀 How to Use Viper System

### Admin Access

1. **Login**: Visit `/admin/login`
   - **Email**: `sandbagexpert@gmail.com`
   - **Password**: `sprinkle`

2. **Admin Dashboard**: Visit `/admin/settings`
   - Toggle dev mode on/off
   - View system status
   - Access quick navigation to landing pages

### Dev Mode Features

When dev mode is enabled and you're logged in as admin:

#### 🐍 Viper Dev Panel
- **Toggle**: Click the snake icon (🐍) in bottom-right corner
- **Keyboard Shortcut**: `Alt+Shift+D` to toggle panel
- **Features**:
  - Auto-fill form data for testing
  - Auto-submit checkout flows
  - Execution logging and timing
  - Quick navigation between pages

#### ⌨️ Keyboard Shortcuts
- `Alt+Shift+1` - Execute first dev action
- `Alt+Shift+2` - Execute second dev action  
- `Alt+Shift+3` - Execute third dev action
- `Alt+Shift+D` - Toggle dev panel

#### 🎯 Page-Specific Actions

**Maps Booster Deluxe**:
- Auto-Fill Business Info (HVAC test data)
- Auto-Fill Contact Info (Developer test data)
- Complete Flow Test (Full checkout with test data)

**MoonTracker (Ranktracker)**:
- Auto-Fill Account Info
- Auto-Fill Payment Info  
- Open Checkout & Apply Promo Code (SAVE20)
- Jump to Confirmation Step

**Tregnar**: (Similar pattern - update as needed)

## 🔧 System Architecture

### API Routes
- `/api/viper/auth` - Authentication (login/logout/verify)
- `/api/viper/config` - Configuration management
- `/api/viper/dev-action` - Dev action logging

### Components
- `AdminAuthProvider` - Global authentication context
- `ViperDevPanel` - Enhanced dev panel with logging
- `useDevFeatures()` - Hook for conditional dev features

### Database Tables
- `viper_admin_users` - Admin user accounts
- `viper_admin_sessions` - Active sessions
- `viper_config` - System configuration
- `viper_admin_audit_log` - Audit trail
- `viper_dev_actions` - Dev feature usage logs
- `viper_allowed_ips` - IP whitelist (if enabled)

## 🛡️ Security Features

### Production Considerations

1. **Change Default Credentials**:
   ```sql
   UPDATE viper_admin_users 
   SET email = 'your-email@domain.com', 
       password_hash = '$2b$12$your_new_bcrypt_hash'
   WHERE email = 'sandbagexpert@gmail.com';
   ```

2. **Disable Dev Mode**:
   ```sql
   UPDATE viper_config 
   SET config_value = 'false' 
   WHERE config_key = 'dev_mode_enabled';
   ```

3. **Enable IP Restrictions** (optional):
   ```sql
   UPDATE viper_config 
   SET config_value = 'true' 
   WHERE config_key = 'ip_check_enabled';
   ```

4. **Enable RLS Policies**:
   ```sql
   -- Uncomment the RLS lines in viper_system_schema.sql
   ALTER TABLE viper_admin_users ENABLE ROW LEVEL SECURITY;
   -- ... (enable for all tables)
   ```

### Session Security
- JWT tokens with 8-hour expiration
- HTTP-only cookies
- IP address validation (optional)
- User agent checking
- Session invalidation on logout

### Audit Logging
- All admin actions logged
- Dev mode usage tracked
- Failed login attempts monitored
- Rate limiting (5 attempts per hour)

## 🧪 Testing

### Test Dev Mode
1. Login to admin panel
2. Enable dev mode in settings
3. Visit any landing page
4. Click the 🐍 icon to open Viper panel
5. Test auto-fill and keyboard shortcuts

### Test Checkout Flows
1. Use "Complete Flow Test" actions
2. Verify form data populates correctly  
3. Check execution logs in dev panel
4. Test keyboard shortcuts work

### Test Admin Features
1. Toggle dev mode on/off
2. Verify changes reflect on landing pages
3. Check audit logs in database
4. Test logout and re-login

## 🔍 Debugging

### Common Issues

1. **Dev panel not showing**:
   - Check if logged in as admin
   - Verify dev mode is enabled
   - Clear browser cache

2. **Authentication errors**:
   - Check Supabase connection
   - Verify environment variables
   - Check JWT secret is set

3. **Database errors**:
   - Ensure all Viper tables exist
   - Check service role key permissions
   - Verify foreign key constraints

### Debug Commands

```javascript
// In browser console
console.log('Viper Auth:', useAdminAuth())
console.log('Dev Features:', useDevFeatures())

// Check local storage
localStorage.getItem('viper_debug')
```

## 🎉 Success!

If everything is working:
- ✅ Admin login works at `/admin/login`
- ✅ Settings dashboard loads at `/admin/settings`  
- ✅ Dev mode toggles work
- ✅ Viper dev panel shows on landing pages
- ✅ Auto-fill actions work
- ✅ Keyboard shortcuts respond
- ✅ Execution logs appear

The Viper System is now fully operational! 🐍

---

**Need Help?** Check the browser console for error messages or review the database audit logs for troubleshooting.