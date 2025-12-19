-- =====================================================
-- SUPABASE STORAGE SETUP FOR IMAGE UPLOADS
-- =====================================================
-- Run this in Supabase SQL Editor OR use the Dashboard
-- =====================================================

-- =====================================================
-- OPTION 1: Using Supabase Dashboard (Recommended)
-- =====================================================
-- 1. Go to Storage in Supabase Dashboard
-- 2. Click "Create a new bucket"
-- 3. Name: "images"
-- 4. Public bucket: YES (so images are accessible)
-- 5. Click "Create bucket"

-- =====================================================
-- OPTION 2: Using SQL (if you prefer)
-- =====================================================

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true)
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- STORAGE POLICIES
-- =====================================================

-- Allow public to read images
CREATE POLICY "Public can read images"
ON storage.objects FOR SELECT
USING (bucket_id = 'images');

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'images' 
  AND auth.role() = 'authenticated'
);

-- Allow admins to delete images
CREATE POLICY "Admins can delete images"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'images'
  AND EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE admin_users.id = auth.uid()
  )
);

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'images';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- =====================================================
-- STORAGE SETUP COMPLETE
-- =====================================================
-- Images will be accessible at:
-- https://YOUR_PROJECT.supabase.co/storage/v1/object/public/images/FILENAME
-- =====================================================
