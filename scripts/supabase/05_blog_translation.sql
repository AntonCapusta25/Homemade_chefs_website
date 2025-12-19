-- Add language support to blog_posts table
-- Migration: Add language and translation fields

-- Add language column (default to 'en' for existing posts)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS language VARCHAR(2) DEFAULT 'en' CHECK (language IN ('en', 'nl', 'fr'));

-- Add translated_from_id to link translations together (INTEGER to match id column)
ALTER TABLE blog_posts 
ADD COLUMN IF NOT EXISTS translated_from_id INTEGER REFERENCES blog_posts(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_language ON blog_posts(language);
CREATE INDEX IF NOT EXISTS idx_blog_posts_translated_from ON blog_posts(translated_from_id);

-- Add comment for documentation
COMMENT ON COLUMN blog_posts.language IS 'Language code: en (English), nl (Dutch), fr (French)';
COMMENT ON COLUMN blog_posts.translated_from_id IS 'Links to the original post if this is a translation';
