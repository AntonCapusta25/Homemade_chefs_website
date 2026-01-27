# Chef Authentication System - Deployment Guide

## Overview

This guide will help you deploy the Supabase authentication system for your learning platform. The system uses auto-generated passwords where chefs receive their credentials via email and can log in immediately.

## Prerequisites

- Supabase account and project
- SendGrid account for email delivery (already integrated)
- Supabase CLI installed: `npm install -g supabase`

## Step 1: Database Setup

1. Open your Supabase project dashboard
2. Go to **SQL Editor**
3. Run the following SQL script:

```bash
scripts/supabase/08_chef_authentication.sql
```

This creates:
- `chef_users` table for chef profiles
- RLS policies for security
- Helper functions (Note: `chef_invites` table is no longer used)

## Step 2: Deploy Edge Function

### Link to your Supabase project

```bash
cd /Users/alexandrfilippov/Homemade_chefs_website-3
supabase link --project-ref vfkmcamplptlkgurnnzi
```

### Deploy the function

```bash
# Deploy send-chef-invite function
supabase functions deploy send-chef-invite
```

## Step 3: Configure Environment Variables

### In Supabase Dashboard

Go to **Edge Functions → Secrets** and add:

```bash
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FROM_EMAIL=Chefs@homemademeals.net
LEARNING_PLATFORM_URL=https://www.homemadechefs.com
```

### In your .env.local (for local development)

```bash
# Already configured
NEXT_PUBLIC_SUPABASE_URL=https://vfkmcamplptlkgurnnzi.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key

# Add these for local testing
SENDGRID_API_KEY=SG.xxxxxxxxxxxxx
FROM_EMAIL=Chefs@homemademeals.net
LEARNING_PLATFORM_URL=http://localhost:3000
```

## Step 4: Get SendGrid API Key

1. Go to your SendGrid dashboard
2. Navigate to **Settings → API Keys**
3. Create a new API key with "Mail Send" permissions
4. Copy the key and add it to Supabase secrets and .env.local

## Step 5: Test the System

### Test Account Creation (Local)

```bash
# Start Supabase functions locally
supabase functions serve

# In another terminal, test account creation
curl -X POST http://localhost:54321/functions/v1/send-chef-invite \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","name":"Test Chef"}'
```

### Test Account Creation (Production)

```bash
curl -X POST https://vfkmcamplptlkgurnnzi.supabase.co/functions/v1/send-chef-invite \
  -H "Authorization: Bearer YOUR_ANON_KEY" \
  -H "Content-Type": "application/json" \
  -d '{"email":"test@example.com","name":"Test Chef"}'
```

## Step 6: Integrate with Lovable Catering Website

In your Lovable project, add this code to the "Go to Learning Platform" button:

```typescript
const handleSendInvite = async () => {
  const { data, error } = await supabase.functions.invoke('send-chef-invite', {
    body: { 
      email: chef.email,  // Chef's email from your form/database
      name: chef.name     // Chef's name
    }
  })

  if (error) {
    console.error('Error creating account:', error)
    alert('Failed to create account')
    return
  }

  if (data.error) {
    alert(data.error)
    return
  }

  // Success!
  alert(`Account created! Credentials sent to ${chef.email}`)
}
```

## The Complete Flow

1. **Catering Website**: User clicks "Go to Learning Platform"
2. **Edge Function**: `send-chef-invite` creates account with auto-generated password
3. **Email**: Chef receives email with login credentials
4. **Learning Platform**: Chef logs in with email + password
5. **Full Access**: Chef has immediate access to all learning resources

## Troubleshooting

### Email not sending

- Check SendGrid API key is correct
- Verify FROM_EMAIL is configured and verified in SendGrid
- Check SendGrid dashboard for delivery logs and errors
- Ensure API key has "Mail Send" permissions
- Note: Account is still created even if email fails

### Login not working

- Verify credentials from email are correct
- Check that account was created in Supabase Auth dashboard
- Clear browser cookies and try again

### Authentication not persisting

- Check middleware.ts is in place
- Verify Supabase client configuration
- Clear browser cookies and try again

## Security Notes

- Passwords are randomly generated (12 characters, alphanumeric + symbols)
- Chefs should change their password after first login
- RLS policies protect all data
- Service role key is only used in Edge Functions
- Email is auto-confirmed since chefs are invited

## Next Steps

1. Deploy your Next.js app to Vercel/production
2. Update LEARNING_PLATFORM_URL in Supabase secrets
3. Test the full flow from catering site → email → learning platform
4. Customize the email template in `send-chef-invite/index.ts`
5. Add password change functionality to the learning platform

## Support

If you encounter issues:
1. Check Supabase Edge Function logs
2. Check browser console for errors
3. Verify all environment variables are set
4. Test each step independently
