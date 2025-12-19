# Supabase Edge Function Deployment Guide

## Prerequisites
1. Install Supabase CLI:
```bash
brew install supabase/tap/supabase
```

2. Login to Supabase:
```bash
supabase login
```

3. Link to your project:
```bash
supabase link --project-ref your-project-ref
```

## Setup Gemini API Key

Add your Gemini API key as a secret:
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key_here
```

## Deploy the Function

```bash
supabase functions deploy translate-post
```

## Test the Function

```bash
curl -i --location --request POST 'https://your-project-ref.supabase.co/functions/v1/translate-post' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"postId": 1, "targetLang": "nl"}'
```

## Function URL

Once deployed, your function will be available at:
```
https://your-project-ref.supabase.co/functions/v1/translate-post
```

## Environment Variables

The function automatically has access to:
- `SUPABASE_URL` - Your Supabase project URL
- `SUPABASE_ANON_KEY` - Your anon/public key
- `GEMINI_API_KEY` - Your Gemini API key (set via secrets)

## Security

- ✅ Requires authentication (Authorization header)
- ✅ Verifies user is in `admin_users` table
- ✅ API key stored securely in Supabase secrets
- ✅ CORS enabled for your domain

## Monitoring

View logs:
```bash
supabase functions logs translate-post
```

## Local Development

Run locally:
```bash
supabase functions serve translate-post --env-file ./supabase/.env.local
```

Create `supabase/.env.local`:
```
GEMINI_API_KEY=your_key_here
```
