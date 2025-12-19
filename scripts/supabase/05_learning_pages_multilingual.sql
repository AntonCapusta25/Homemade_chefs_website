-- =====================================================
-- LEARNING PAGES MULTILINGUAL SUPPORT
-- =====================================================
-- Run this in Supabase SQL Editor to add translation support
-- =====================================================

-- Add language and source_id columns
ALTER TABLE public.learning_pages
ADD COLUMN IF NOT EXISTS language TEXT DEFAULT 'en',
ADD COLUMN IF NOT EXISTS source_id INTEGER REFERENCES public.learning_pages(id) ON DELETE CASCADE;

-- Add comments
COMMENT ON COLUMN public.learning_pages.language IS 'Language code: en, nl, fr';
COMMENT ON COLUMN public.learning_pages.source_id IS 'Reference to source (English) page for translations';

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_learning_pages_language ON public.learning_pages(language);
CREATE INDEX IF NOT EXISTS idx_learning_pages_source ON public.learning_pages(source_id);

-- Update slug constraint to allow same slug for different languages
ALTER TABLE public.learning_pages DROP CONSTRAINT IF EXISTS learning_pages_slug_key;
CREATE UNIQUE INDEX learning_pages_slug_language_unique ON public.learning_pages(slug, language);

-- Update existing pages to be English
UPDATE public.learning_pages
SET language = 'en'
WHERE language IS NULL OR language = '';

-- Make language NOT NULL after setting defaults
ALTER TABLE public.learning_pages
ALTER COLUMN language SET NOT NULL;

-- =====================================================
-- VERIFICATION
-- =====================================================

-- Check columns exist
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'learning_pages'
AND column_name IN ('language', 'source_id');

-- Check existing pages have language set
SELECT id, title, language, source_id
FROM public.learning_pages
ORDER BY id;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
