# 230landers - Vercel Deployment Guide

## Overview
230landers is a Next.js application with multiple landing pages and checkout systems, optimized for Vercel deployment.

## Pre-Deployment Checklist

### 1. Environment Variables
Before deploying to Vercel, configure these environment variables in your Vercel project:

**Production Variables:**
```
NODE_ENV=production
ADMIN_MODE_ENABLED=false
ADMIN_EMAIL=admin@leadtrain.net
NEXT_PUBLIC_API_URL=https://your-domain.vercel.app/api
```

**When implementing payment processing:**
```
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
```

**When implementing email services:**
```
SMTP_HOST=your_smtp_host
SMTP_PORT=587
SMTP_USER=your_smtp_username
SMTP_PASSWORD=your_smtp_password
```

### 2. Domain Configuration
- Set up your custom domain in Vercel (e.g., `landers.leadtrain.net`)
- Update `NEXT_PUBLIC_API_URL` to match your domain
- Configure DNS records as required

## Deployment Steps

### Option 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy from project root
cd 230landers
vercel

# For production deployment
vercel --prod
```

### Option 2: GitHub Integration
1. Push code to GitHub repository
2. Connect repository to Vercel
3. Configure build settings:
   - **Framework Preset:** Next.js
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

### Option 3: Manual Upload
1. Run `npm run build` locally
2. Upload `.next` folder and `package.json` to Vercel

## Build Configuration

The project includes:
- `vercel.json` - Vercel configuration
- `next.config.js` - Next.js configuration
- TypeScript configuration
- Tailwind CSS setup

## API Routes

The following API endpoints are available:
- `/api/process-payment` - Ranktracker checkout processing
- `/api/maps-booster/checkout` - Maps Booster Deluxe signup
- `/api/tregnar/signup` - Tregnar SaaS account creation
- `/api/admin/auth` - Admin authentication (dev mode)

## Pages

- `/` - Main landing page (if implemented)
- `/maps-booster-deluxe` - Google Maps optimization service
- `/tregnar` - SaaS platform for website management
- `/ranktracker` - SEO rank tracking software

## Post-Deployment Testing

1. **Page Loading:** Test all landing pages load correctly
2. **API Endpoints:** Verify API routes respond properly
3. **Checkout Flows:** Test all checkout processes
4. **Admin Panel:** Verify admin dev panel is disabled in production
5. **Mobile Responsiveness:** Test on various devices

## Admin/Dev Mode

- **Development:** Admin panel available with authentication
- **Production:** Admin mode disabled for security
- Toggle via `ADMIN_MODE_ENABLED` environment variable

## Performance Optimizations

- Next.js App Router for optimal performance
- Static generation where possible
- Optimized images and assets
- Minimal JavaScript bundles

## Security Considerations

- Environment variables properly configured
- Admin mode disabled in production
- API rate limiting (implement as needed)
- Form validation and sanitization
- HTTPS enforced on all routes

## Monitoring

Consider implementing:
- Error tracking (Sentry, Vercel Analytics)
- Performance monitoring
- User analytics
- Checkout conversion tracking

## Troubleshooting

**Build Failures:**
- Check TypeScript compilation errors
- Verify all imports are correct
- Ensure environment variables are set

**API Issues:**
- Verify API routes are properly defined
- Check environment variable configuration
- Monitor Vercel function logs

**Styling Issues:**
- Ensure Tailwind CSS is properly configured
- Check for missing CSS imports
- Verify responsive design breakpoints

## Support

For deployment issues:
1. Check Vercel deployment logs
2. Verify environment variable configuration
3. Test locally with `npm run build && npm start`
4. Contact Lead Train development team if needed

## Next Steps After Deployment

1. **Database Integration:** Set up persistent data storage
2. **Payment Processing:** Implement real payment gateway
3. **Email Services:** Configure transactional emails
4. **Analytics:** Set up conversion tracking
5. **A/B Testing:** Implement landing page optimization