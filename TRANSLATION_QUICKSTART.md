# Blog Translation System - Quick Start

## ✅ What's Been Created

1. **Supabase Edge Function** (`supabase/functions/translate-post`)
   - Secure translation API using Gemini
   - Admin authentication required
   - Production-ready

2. **Admin UI Component** (`src/components/admin/BlogTranslationEditor.tsx`)
   - Tabbed editor (EN/NL/FR)
   - One-click translation
   - Review before saving

## 🚀 Deployment Steps

### 1. Install Supabase CLI
```bash
brew install supabase/tap/supabase
supabase login
```

### 2. Link Your Project
```bash
supabase link --project-ref your-project-ref
```

### 3. Add Gemini API Key
```bash
supabase secrets set GEMINI_API_KEY=your_gemini_api_key
```

### 4. Deploy Edge Function
```bash
supabase functions deploy translate-post
```

## 📝 How to Use

### In Admin Panel

1. Open a blog post for editing
2. You'll see 3 tabs: EN / NL / FR
3. Click on NL or FR tab
4. Click "🌍 Translate from English"
5. Wait ~10 seconds
6. Review the translation
7. Edit if needed
8. Click "💾 Save"

### For Multiple Employees

- Each employee needs admin access in `admin_users` table
- They login with their Supabase account
- Translation works from anywhere (web, mobile, etc.)
- API key is secure (never exposed)

## 🔒 Security

✅ Requires authentication
✅ Verifies admin status
✅ API key stored in Supabase secrets
✅ CORS enabled

## 💰 Cost

- Gemini 1.5 Flash: **FREE** up to 15 req/min
- Well within free tier for blog translation

## 🎯 Next Steps

1. Deploy the edge function (see above)
2. Integrate `BlogTranslationEditor` into your admin panel
3. Test with one post
4. Roll out to team

## 📞 Support

- View logs: `supabase functions logs translate-post`
- Test locally: `supabase functions serve translate-post`
