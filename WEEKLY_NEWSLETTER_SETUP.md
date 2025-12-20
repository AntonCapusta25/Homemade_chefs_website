# Weekly Newsletter System

This system sends automated weekly newsletters to all active subscribers with fresh blog content.

## Features

- ✅ **Smart Content Tracking**: Never sends the same blog post twice to a subscriber
- ✅ **Beautiful Email Template**: Professional HTML email design matching your brand
- ✅ **Automatic Filtering**: Only sends emails if there's new content available
- ✅ **Detailed Logging**: Tracks success/failure for each email sent
- ✅ **SendGrid Integration**: Uses your existing SendGrid setup

## How It Works

1. **Fetches Active Subscribers**: Gets all subscribers with `is_active = true`
2. **Checks Sent History**: For each subscriber, queries `newsletter_emails_sent` table to see which articles they've already received
3. **Finds New Content**: Fetches the latest 20 published blog posts and filters out already-sent ones
4. **Sends Top 3**: Sends an email with the top 3 new articles (if available)
5. **Tracks Delivery**: Records the sent articles in `newsletter_emails_sent` to prevent duplicates

## Setup Instructions

### 1. Deploy the Function

```bash
cd /Users/alexandrfilippov/Homemade_chefs_website-1
supabase functions deploy send-weekly-newsletter
```

### 2. Set Up Weekly Cron Job

You have two options:

#### Option A: Supabase Cron (Recommended)

Add this to your Supabase project via SQL Editor:

```sql
-- Enable pg_cron extension
CREATE EXTENSION IF NOT EXISTS pg_cron;

-- Schedule weekly newsletter every Monday at 9 AM UTC
SELECT cron.schedule(
    'send-weekly-newsletter',
    '0 9 * * 1',  -- Every Monday at 9 AM
    $$
    SELECT
      net.http_post(
          url:='https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-weekly-newsletter',
          headers:='{"Content-Type": "application/json", "Authorization": "Bearer YOUR_SERVICE_ROLE_KEY"}'::jsonb
      ) as request_id;
    $$
);
```

Replace:
- `YOUR_PROJECT_REF` with your Supabase project reference
- `YOUR_SERVICE_ROLE_KEY` with your service role key

#### Option B: External Cron Service

Use a service like:
- **Cron-job.org**: Free, easy to set up
- **GitHub Actions**: If you want it in your repo
- **Vercel Cron**: If deploying on Vercel

Example curl command for external cron:
```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-weekly-newsletter' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

### 3. Test the Function

Test manually before setting up the cron:

```bash
curl -X POST \
  'https://YOUR_PROJECT_REF.supabase.co/functions/v1/send-weekly-newsletter' \
  -H 'Authorization: Bearer YOUR_SERVICE_ROLE_KEY' \
  -H 'Content-Type: application/json'
```

## Email Template

The weekly newsletter includes:
- **Header**: "Your Weekly Chef Digest 📰"
- **Personalized Greeting**: "Hi Chef! 👋"
- **3 Article Cards**: Each with image, title, excerpt, and "Read More" button
- **CTA**: "Start Your Chef Business" button
- **Footer**: Unsubscribe link and website link

## Database Tables Used

### `newsletter_subscribers`
- Stores all newsletter subscribers
- `is_active` field determines who receives emails

### `newsletter_emails_sent`
- Tracks every email sent
- `articles_included` array stores slugs of articles sent
- `email_type` = 'weekly_digest' for weekly newsletters
- `metadata` stores additional info (article count, send time, etc.)

### `blog_posts`
- Source of content for newsletters
- Only `is_published = true` and `language = 'en'` posts are included

## Customization

### Change Send Frequency

Edit the cron schedule:
- **Daily**: `0 9 * * *`
- **Weekly (Monday)**: `0 9 * * 1`
- **Bi-weekly**: `0 9 * * 1/2`
- **Monthly**: `0 9 1 * *`

### Change Number of Articles

In `index.ts`, line ~170:
```typescript
.slice(0, 3) // Change 3 to desired number
```

### Customize Email Template

Edit the `getWeeklyNewsletterHTML()` function in `index.ts` to match your brand.

## Monitoring

Check the function logs in Supabase Dashboard:
1. Go to Edge Functions
2. Select `send-weekly-newsletter`
3. View Logs tab

The response includes stats:
```json
{
  "message": "Weekly newsletter sent",
  "stats": {
    "total_subscribers": 150,
    "emails_sent": 142,
    "emails_failed": 8
  }
}
```

## Troubleshooting

### No Emails Sent
- Check if there are active subscribers: `SELECT COUNT(*) FROM newsletter_subscribers WHERE is_active = true`
- Verify new blog posts exist: `SELECT COUNT(*) FROM blog_posts WHERE is_published = true`

### SendGrid Errors
- Verify `SENDGRID_API_KEY` is set correctly
- Check SendGrid dashboard for delivery issues
- Ensure sender email is verified in SendGrid

### Duplicate Content
- The system automatically prevents duplicates by checking `newsletter_emails_sent`
- If duplicates occur, check the `articles_included` array is being saved correctly

## Future Enhancements

Potential improvements:
- [ ] Multi-language support (send in subscriber's preferred language)
- [ ] Personalized content based on subscriber interests
- [ ] A/B testing for subject lines
- [ ] Analytics tracking (open rates, click rates)
- [ ] Unsubscribe handling
