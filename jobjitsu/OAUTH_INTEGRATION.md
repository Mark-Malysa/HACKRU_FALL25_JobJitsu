# OAuth Integration Guide

This document explains how the OAuth integration works in the JobJitsu frontend.

## Overview

The signin page (`/signin`) now supports three authentication methods:
1. **Email/Password** - Direct Supabase authentication
2. **Google OAuth** - Direct Supabase OAuth
3. **GitHub OAuth** - Direct Supabase OAuth

## File Structure

```
src/app/
└── signin/
    └── page.tsx          # Main signin/signup page with OAuth
```

## How It Works

### 1. Signin Page (`/signin/page.tsx`)

**Features:**
- Toggle between Sign In and Sign Up modes
- OAuth buttons for Google and GitHub
- Email/password form with validation
- Loading states and error handling
- Password visibility toggle
- Responsive design with modern UI

**OAuth Flow:**
1. User clicks "Continue with Google/GitHub"
2. Supabase handles OAuth redirect to provider
3. User authenticates with provider
4. Provider redirects back to Supabase
5. Supabase redirects to `/practice` page
6. User is automatically signed in

## Supabase Integration

The frontend uses Supabase for all authentication:

```javascript
// Email/Password Authentication
supabase.auth.signUp({ email, password })
supabase.auth.signInWithPassword({ email, password })

// OAuth Authentication
supabase.auth.signInWithOAuth({
  provider: 'google', // or 'github'
  options: {
    redirectTo: `${window.location.origin}/practice`
  }
})
```

## Configuration

### Supabase Configuration
Make sure your Supabase project has OAuth providers enabled:

1. Go to your Supabase Dashboard
2. Navigate to Authentication > Providers
3. Enable Google and GitHub providers
4. Add your OAuth credentials

### OAuth Provider Setup

#### Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URI: `https://your-project.supabase.co/auth/v1/callback`

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Create OAuth App
3. Set Authorization callback URL: `https://your-project.supabase.co/auth/v1/callback`

## Testing

### 1. Start Frontend
```bash
cd jobjitsu
npm run dev
```

### 2. Test OAuth Flow
1. Go to `http://localhost:3000/signin`
2. Click "Continue with Google" or "Continue with GitHub"
3. Complete OAuth flow
4. Should redirect to practice page

## Error Handling

The integration includes comprehensive error handling:
- Network errors
- OAuth configuration errors
- Invalid credentials
- Backend unavailability
- User cancellation

## User Data Storage

After successful OAuth authentication:
- User data stored in `localStorage.user`
- Access token stored in `localStorage.access_token`
- User redirected to `/practice` page

## Customization

### Styling
The signin page uses your existing design system:
- Tailwind CSS classes
- shadcn/ui components
- Consistent with app theme

### OAuth Providers
To add more OAuth providers:
1. Add backend endpoint in `routers/auth.py`
2. Add button in `signin/page.tsx`
3. Add handler function
4. Update callback page if needed

## Security Notes

- OAuth URLs are generated server-side
- Access tokens are handled securely
- User data is validated on backend
- CORS is properly configured
- No sensitive data in frontend code

## Troubleshooting

### Common Issues

1. **"OAuth not configured" error**
   - Check backend `.env` file
   - Verify OAuth provider credentials
   - Restart backend server

2. **Callback page not loading**
   - Check redirect URI configuration
   - Verify backend is running
   - Check browser console for errors

3. **User not redirected after auth**
   - Check localStorage for user data
   - Verify callback page logic
   - Check network requests in dev tools

### Debug Mode
Add `console.log` statements in the OAuth handlers to debug issues:
```javascript
console.log("OAuth response:", data);
console.log("User data:", userData);
```
