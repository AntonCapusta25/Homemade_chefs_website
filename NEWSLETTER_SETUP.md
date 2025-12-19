# Newsletter System Setup Guide

## Overview
Complete newsletter subscription system with SendGrid integration and beautiful welcome emails.

## Components Created

### 1. Database Table
**File:** `scripts/supabase/06_newsletter_subscribers.sql`
- Stores subscriber emails
- Tracks subscription status
- RLS policies for security

### 2. Edge Function
**File:** `supabase/functions/newsletter-subscribe/index.ts`
- Handles subscription requests
- Sends welcome emails via SendGrid
- Includes 3 latest blog articles in email

### 3. Frontend Component
**File:** `src/components/NewsletterForm.tsx`
- Beautiful form with loading states
- Success/error messaging
- Disabled state after subscription

## Setup Steps

### 1. Run Database Migration
```bash
# In Supabase SQL Editor, run:
scripts/supabase/06_newsletter_subscribers.sql
```

### 2. Get SendGrid API Key
1. Go to https://sendgrid.com
2. Create account / Sign in
3. Go to Settings → API Keys
4. Create new API key with "Mail Send" permissions
5. Copy the API key

### 3. Configure Edge Function Secrets
```bash
# Set SendGrid API key
supabase secrets set SENDGRID_API_KEY=your_sendgrid_api_key_here

# Verify secrets
supabase secrets list
```

### 4. Deploy Edge Function
```bash
# Deploy the newsletter function
supabase functions deploy newsletter-subscribe

# Test it
curl -X POST \
  'https://your-project.supabase.co/functions/v1/newsletter-subscribe' \
  -H 'Authorization: Bearer YOUR_ANON_KEY' \
  -H 'Content-Type: application/json' \
  -d '{"email":"test@example.com"}'
```

### 5. Update Environment Variables
Add to `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

### 6. Use the Component
Replace the existing newsletter form in your Footer component:

```tsx
import NewsletterForm from '@/components/NewsletterForm';

// In your Footer.tsx or wherever the form is:
<NewsletterForm />
```

## Email Template Features

The welcome email includes:
- ✅ Beautiful responsive design
- ✅ Gradient header with welcome message
- ✅ 3 latest blog articles with images
- ✅ "Read More" buttons linking to articles
- ✅ Contact section
- ✅ Footer with logo and social links
- ✅ Unsubscribe link

## Customization

### Change Email Sender
In `supabase/functions/newsletter-subscribe/index.ts`:
```typescript
from: {
  email: 'your-email@yourdomain.com',
  name: 'Your Name'
}
```

### Modify Email Template
Edit the `getWelcomeEmailHTML()` function in the edge function.

### Change Article Count
Modify the `.limit(3)` in the blog posts query.

## Testing

### Test Subscription
1. Go to your website
2. Enter email in newsletter form
3. Click subscribe
4. Check email inbox for welcome message

### View Subscribers
```sql
SELECT * FROM newsletter_subscribers ORDER BY subscribed_at DESC;
```

### Test Email Locally
Use SendGrid's test mode or send to your own email first.

## Troubleshooting

### Email not sending
- Check SendGrid API key is correct
- Verify sender email is verified in SendGrid
- Check edge function logs: `supabase functions logs newsletter-subscribe`

### Database errors
- Ensure migration was run successfully
- Check RLS policies are enabled
- Verify anon key has insert permissions

### CORS errors
- Edge function includes CORS headers
- Check browser console for specific errors

## Next Steps

1. **Verify SendGrid Sender**: Verify your sender email in SendGrid dashboard
2. **Test Email**: Send test email to yourself
3. **Deploy Function**: Deploy to production
4. **Monitor**: Check SendGrid dashboard for email delivery stats

## Support

For issues:
- Check Supabase logs
- Check SendGrid activity feed
- Review browser console errors
