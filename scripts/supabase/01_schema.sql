-- =====================================================
-- HOMEMADE CHEFS - SUPABASE DATABASE SCHEMA
-- =====================================================
-- Run this in Supabase SQL Editor to set up the database
-- =====================================================

-- =====================================================
-- 1. CONTENT SECTIONS TABLE
-- =====================================================
-- Stores all editable content sections (hero, CTA, features, etc.)

CREATE TABLE IF NOT EXISTS public.content_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  section_key TEXT UNIQUE NOT NULL,
  page TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.content_sections IS 'Stores editable content sections for all pages';
COMMENT ON COLUMN public.content_sections.section_key IS 'Unique identifier like "home.hero" or "pricing.hero"';
COMMENT ON COLUMN public.content_sections.page IS 'Page name: home, join, pricing, learning, accessories, blog';
COMMENT ON COLUMN public.content_sections.data IS 'JSON data for the content section';

-- =====================================================
-- 2. BLOG POSTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  category TEXT NOT NULL,
  excerpt TEXT,
  content TEXT NOT NULL,
  image TEXT,
  published_date DATE NOT NULL DEFAULT CURRENT_DATE,
  author_name TEXT NOT NULL,
  author_role TEXT,
  author_avatar TEXT,
  tags TEXT[] DEFAULT '{}',
  related_post_ids INTEGER[] DEFAULT '{}',
  gallery_images TEXT[] DEFAULT '{}',
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.blog_posts IS 'Blog articles and posts';
COMMENT ON COLUMN public.blog_posts.slug IS 'URL-friendly slug, auto-generated from title';
COMMENT ON COLUMN public.blog_posts.content IS 'HTML content of the blog post';
COMMENT ON COLUMN public.blog_posts.is_published IS 'Whether the post is visible to public';

-- Create index for faster slug lookups
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON public.blog_posts(is_published, published_date DESC);

-- =====================================================
-- 3. PRODUCTS TABLE
-- =====================================================

CREATE TABLE IF NOT EXISTS public.products (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  category TEXT NOT NULL,
  badge TEXT,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  description TEXT,
  image TEXT,
  stock_quantity INTEGER DEFAULT 0 CHECK (stock_quantity >= 0),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

COMMENT ON TABLE public.products IS 'Accessories and merchandise products';
COMMENT ON COLUMN public.products.badge IS 'Badge text like "BEST SELLER", "NEW", "ECO"';
COMMENT ON COLUMN public.products.is_active IS 'Whether product is visible in shop';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_products_slug ON public.products(slug);
CREATE INDEX IF NOT EXISTS idx_products_active ON public.products(is_active, category);

-- =====================================================
-- 4. ADMIN USERS TABLE
-- =====================================================
-- Links to Supabase Auth users table

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  role TEXT DEFAULT 'admin' CHECK (role IN ('admin', 'super_admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_login TIMESTAMPTZ
);

COMMENT ON TABLE public.admin_users IS 'Admin users with elevated permissions';
COMMENT ON COLUMN public.admin_users.id IS 'References auth.users(id) from Supabase Auth';
COMMENT ON COLUMN public.admin_users.role IS 'Admin role: admin or super_admin';

-- =====================================================
-- 5. DATABASE FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to generate URL-friendly slug from text
CREATE OR REPLACE FUNCTION generate_slug(input_text TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN lower(
    regexp_replace(
      regexp_replace(input_text, '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+',
      '-',
      'g'
    )
  );
END;
$$ LANGUAGE plpgsql;

-- Function to auto-set slug for blog posts
CREATE OR REPLACE FUNCTION set_blog_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_slug(NEW.title);
    
    -- Handle duplicate slugs by appending a number
    DECLARE
      base_slug TEXT := NEW.slug;
      counter INTEGER := 1;
    BEGIN
      WHILE EXISTS (SELECT 1 FROM public.blog_posts WHERE slug = NEW.slug AND id != COALESCE(NEW.id, 0)) LOOP
        NEW.slug := base_slug || '-' || counter;
        counter := counter + 1;
      END LOOP;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-set slug for products
CREATE OR REPLACE FUNCTION set_product_slug()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.slug IS NULL OR NEW.slug = '' THEN
    NEW.slug = generate_slug(NEW.name);
    
    -- Handle duplicate slugs
    DECLARE
      base_slug TEXT := NEW.slug;
      counter INTEGER := 1;
    BEGIN
      WHILE EXISTS (SELECT 1 FROM public.products WHERE slug = NEW.slug AND id != COALESCE(NEW.id, 0)) LOOP
        NEW.slug := base_slug || '-' || counter;
        counter := counter + 1;
      END LOOP;
    END;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- 6. TRIGGERS
-- =====================================================

-- Auto-update updated_at for content_sections
DROP TRIGGER IF EXISTS update_content_sections_updated_at ON public.content_sections;
CREATE TRIGGER update_content_sections_updated_at
  BEFORE UPDATE ON public.content_sections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for blog_posts
DROP TRIGGER IF EXISTS update_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER update_blog_posts_updated_at
  BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-update updated_at for products
DROP TRIGGER IF EXISTS update_products_updated_at ON public.products;
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Auto-generate slug for blog posts
DROP TRIGGER IF EXISTS set_blog_post_slug ON public.blog_posts;
CREATE TRIGGER set_blog_post_slug
  BEFORE INSERT OR UPDATE ON public.blog_posts
  FOR EACH ROW
  EXECUTE FUNCTION set_blog_slug();

-- Auto-generate slug for products
DROP TRIGGER IF EXISTS set_product_slug_trigger ON public.products;
CREATE TRIGGER set_product_slug_trigger
  BEFORE INSERT OR UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION set_product_slug();

-- =====================================================
-- SCHEMA SETUP COMPLETE
-- =====================================================
-- Next: Run 02_rls_policies.sql to set up Row Level Security
-- =====================================================
