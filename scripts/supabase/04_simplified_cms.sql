-- =====================================================
-- WEBFLOW-STYLE CMS - DATABASE UPDATES
-- =====================================================
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. UPDATE BLOG_POSTS TABLE
-- =====================================================
-- Add SEO and hero image fields

ALTER TABLE public.blog_posts
ADD COLUMN IF NOT EXISTS meta_title TEXT,
ADD COLUMN IF NOT EXISTS meta_description TEXT,
ADD COLUMN IF NOT EXISTS hero_image TEXT;

COMMENT ON COLUMN public.blog_posts.meta_title IS 'SEO meta title (recommended: 50-60 characters)';
COMMENT ON COLUMN public.blog_posts.meta_description IS 'SEO meta description (recommended: 150-160 characters)';
COMMENT ON COLUMN public.blog_posts.hero_image IS 'Hero image URL for blog post';

-- =====================================================
-- 2. CREATE LEARNING_PAGES TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.learning_pages (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  meta_title TEXT,
  meta_description TEXT,
  hero_image TEXT,
  youtube_url TEXT,
  body_content TEXT NOT NULL,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.learning_pages IS 'Educational content pages with video support';
COMMENT ON COLUMN public.learning_pages.slug IS 'URL-friendly slug, auto-generated from title';
COMMENT ON COLUMN public.learning_pages.youtube_url IS 'Full YouTube URL or video ID';
COMMENT ON COLUMN public.learning_pages.body_content IS 'Main content body (supports markdown)';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_learning_pages_slug ON public.learning_pages(slug);
CREATE INDEX IF NOT EXISTS idx_learning_pages_published ON public.learning_pages(is_published);

-- =====================================================
-- 3. TRIGGERS FOR LEARNING_PAGES
-- =====================================================

-- Auto-update updated_at timestamp
DROP TRIGGER IF EXISTS update_learning_pages_updated_at ON public.learning_pages;
CREATE TRIGGER update_learning_pages_updated_at
  BEFORE UPDATE ON public.learning_pages
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug from title
CREATE OR REPLACE FUNCTION set_learning_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_slug(NEW.title);
    
    -- Handle duplicate slugs by appending a number
    DECLARE
      base_slug TEXT := NEW.slug;
      counter INTEGER := 1;
    BEGIN
      WHILE EXISTS (
        SELECT 1 FROM public.learning_pages 
        WHERE slug = NEW.slug 
        AND id != COALESCE(NEW.id, 0)
      ) LOOP
        NEW.slug := base_slug || '-' || counter;
        counter := counter + 1;
      END LOOP;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_learning_page_slug ON public.learning_pages;
CREATE TRIGGER set_learning_page_slug
  BEFORE INSERT OR UPDATE ON public.learning_pages
  FOR EACH ROW
  EXECUTE FUNCTION set_learning_slug();

-- =====================================================
-- 4. ROW LEVEL SECURITY FOR LEARNING_PAGES
-- =====================================================

ALTER TABLE public.learning_pages ENABLE ROW LEVEL SECURITY;

-- Public can read published pages
DROP POLICY IF EXISTS "Public can read published learning pages" ON public.learning_pages;
CREATE POLICY "Public can read published learning pages"
  ON public.learning_pages
  FOR SELECT
  USING (is_published = true);

-- Admins can read all pages
DROP POLICY IF EXISTS "Admins can read all learning pages" ON public.learning_pages;
CREATE POLICY "Admins can read all learning pages"
  ON public.learning_pages
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can insert
DROP POLICY IF EXISTS "Admins can insert learning pages" ON public.learning_pages;
CREATE POLICY "Admins can insert learning pages"
  ON public.learning_pages
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can update
DROP POLICY IF EXISTS "Admins can update learning pages" ON public.learning_pages;
CREATE POLICY "Admins can update learning pages"
  ON public.learning_pages
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Admins can delete
DROP POLICY IF EXISTS "Admins can delete learning pages" ON public.learning_pages;
CREATE POLICY "Admins can delete learning pages"
  ON public.learning_pages
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- =====================================================
-- 5. VERIFICATION
-- =====================================================

-- Check blog_posts has new columns
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'blog_posts' 
AND column_name IN ('meta_title', 'meta_description', 'hero_image');

-- Check learning_pages table exists
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'learning_pages';

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE tablename = 'learning_pages';

-- =====================================================
-- CMS DATABASE SETUP COMPLETE
-- =====================================================
