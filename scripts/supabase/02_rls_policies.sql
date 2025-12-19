-- =====================================================
-- HOMEMADE CHEFS - ROW LEVEL SECURITY POLICIES
-- =====================================================
-- Run this AFTER 01_schema.sql
-- =====================================================

-- =====================================================
-- 1. CONTENT SECTIONS RLS
-- =====================================================

ALTER TABLE public.content_sections ENABLE ROW LEVEL SECURITY;

-- Public can read all content sections
DROP POLICY IF EXISTS "Public can read content sections" ON public.content_sections;
CREATE POLICY "Public can read content sections"
  ON public.content_sections
  FOR SELECT
  USING (true);

-- Only admins can insert content sections
DROP POLICY IF EXISTS "Admins can insert content sections" ON public.content_sections;
CREATE POLICY "Admins can insert content sections"
  ON public.content_sections
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can update content sections
DROP POLICY IF EXISTS "Admins can update content sections" ON public.content_sections;
CREATE POLICY "Admins can update content sections"
  ON public.content_sections
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can delete content sections
DROP POLICY IF EXISTS "Admins can delete content sections" ON public.content_sections;
CREATE POLICY "Admins can delete content sections"
  ON public.content_sections
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- =====================================================
-- 2. BLOG POSTS RLS
-- =====================================================

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Public can read published blog posts
DROP POLICY IF EXISTS "Public can read published posts" ON public.blog_posts;
CREATE POLICY "Public can read published posts"
  ON public.blog_posts
  FOR SELECT
  USING (is_published = true);

-- Admins can read all posts (including unpublished)
DROP POLICY IF EXISTS "Admins can read all posts" ON public.blog_posts;
CREATE POLICY "Admins can read all posts"
  ON public.blog_posts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can insert blog posts
DROP POLICY IF EXISTS "Admins can insert posts" ON public.blog_posts;
CREATE POLICY "Admins can insert posts"
  ON public.blog_posts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can update blog posts
DROP POLICY IF EXISTS "Admins can update posts" ON public.blog_posts;
CREATE POLICY "Admins can update posts"
  ON public.blog_posts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can delete blog posts
DROP POLICY IF EXISTS "Admins can delete posts" ON public.blog_posts;
CREATE POLICY "Admins can delete posts"
  ON public.blog_posts
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- =====================================================
-- 3. PRODUCTS RLS
-- =====================================================

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Public can read active products
DROP POLICY IF EXISTS "Public can read active products" ON public.products;
CREATE POLICY "Public can read active products"
  ON public.products
  FOR SELECT
  USING (is_active = true);

-- Admins can read all products (including inactive)
DROP POLICY IF EXISTS "Admins can read all products" ON public.products;
CREATE POLICY "Admins can read all products"
  ON public.products
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can insert products
DROP POLICY IF EXISTS "Admins can insert products" ON public.products;
CREATE POLICY "Admins can insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can update products
DROP POLICY IF EXISTS "Admins can update products" ON public.products;
CREATE POLICY "Admins can update products"
  ON public.products
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only admins can delete products
DROP POLICY IF EXISTS "Admins can delete products" ON public.products;
CREATE POLICY "Admins can delete products"
  ON public.products
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- =====================================================
-- 4. ADMIN USERS RLS
-- =====================================================

ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read all admin users
DROP POLICY IF EXISTS "Admins can read admin users" ON public.admin_users;
CREATE POLICY "Admins can read admin users"
  ON public.admin_users
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
    )
  );

-- Only super_admins can insert new admin users
DROP POLICY IF EXISTS "Super admins can insert admin users" ON public.admin_users;
CREATE POLICY "Super admins can insert admin users"
  ON public.admin_users
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

-- Admins can update their own profile
DROP POLICY IF EXISTS "Admins can update own profile" ON public.admin_users;
CREATE POLICY "Admins can update own profile"
  ON public.admin_users
  FOR UPDATE
  USING (id = auth.uid());

-- Only super_admins can delete admin users
DROP POLICY IF EXISTS "Super admins can delete admin users" ON public.admin_users;
CREATE POLICY "Super admins can delete admin users"
  ON public.admin_users
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.admin_users
      WHERE admin_users.id = auth.uid()
      AND admin_users.role = 'super_admin'
    )
  );

-- =====================================================
-- RLS POLICIES COMPLETE
-- =====================================================
-- Next: Run 03_seed_data.sql to populate initial data
-- =====================================================
