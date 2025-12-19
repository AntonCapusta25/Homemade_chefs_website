# Supabase Database Setup

This directory contains SQL scripts to set up the Homemade Chefs database in Supabase.

## Prerequisites

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Get your project credentials:
   - Project URL
   - Anon (public) key
   - Service role key

## Setup Instructions

### Step 1: Run SQL Scripts

Execute these scripts **in order** in your Supabase SQL Editor:

1. **`01_schema.sql`** - Creates tables, functions, and triggers
2. **`02_rls_policies.sql`** - Sets up Row Level Security policies
3. **`03_seed_data.sql`** - Populates database with initial content

### Step 2: Create Admin User

1. Go to **Authentication** > **Users** in Supabase dashboard
2. Click **Add user** > **Create new user**
3. Enter email and password for your admin account
4. Copy the user's UUID

### Step 3: Add Admin to Database

Run this SQL query, replacing `YOUR_USER_UUID` and `YOUR_EMAIL`:

```sql
INSERT INTO public.admin_users (id, email, full_name, role)
VALUES (
  'YOUR_USER_UUID',
  'YOUR_EMAIL',
  'Admin User',
  'super_admin'
);
```

### Step 4: Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials.

## Database Schema

### Tables

- **`content_sections`** - Editable content for all pages
- **`blog_posts`** - Blog articles
- **`products`** - Accessories/merchandise
- **`admin_users`** - Admin user metadata

### Key Features

- ✅ Row Level Security (RLS) enabled on all tables
- ✅ Public read access for content
- ✅ Admin-only write access
- ✅ Auto-updating timestamps
- ✅ Auto-generating slugs from titles
- ✅ Referential integrity with foreign keys

## Testing

After setup, verify:

```sql
-- Check tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Check seed data loaded
SELECT COUNT(*) FROM public.content_sections;
SELECT COUNT(*) FROM public.blog_posts;
SELECT COUNT(*) FROM public.products;
```

## Troubleshooting

**Error: "permission denied for table"**
- Make sure RLS policies are created (run `02_rls_policies.sql`)
- Verify admin user exists in `admin_users` table

**Error: "duplicate key value"**
- Data already exists, safe to ignore or use `ON CONFLICT` clauses

**Slugs not generating**
- Check triggers are created: `SELECT * FROM pg_trigger WHERE tgname LIKE '%slug%';`

## Next Steps

After database setup:
1. Install Supabase client library in frontend
2. Update environment variables
3. Replace server actions with Supabase queries
4. Test authentication flow
