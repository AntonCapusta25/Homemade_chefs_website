-- Newsletter email tracking table
CREATE TABLE IF NOT EXISTS public.newsletter_emails_sent (
    id BIGSERIAL PRIMARY KEY,
    subscriber_id BIGINT REFERENCES public.newsletter_subscribers(id) ON DELETE CASCADE,
    email_type TEXT NOT NULL DEFAULT 'welcome',
    sent_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    articles_included JSONB DEFAULT '[]'::jsonb,
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_emails_subscriber ON public.newsletter_emails_sent(subscriber_id);
CREATE INDEX IF NOT EXISTS idx_newsletter_emails_type ON public.newsletter_emails_sent(email_type);
CREATE INDEX IF NOT EXISTS idx_newsletter_emails_sent_at ON public.newsletter_emails_sent(sent_at);

-- Enable RLS
ALTER TABLE public.newsletter_emails_sent ENABLE ROW LEVEL SECURITY;

-- Policy: Only authenticated users can view email history
CREATE POLICY "Only authenticated users can view email history"
ON public.newsletter_emails_sent
FOR SELECT
TO authenticated
USING (true);

-- Comments
COMMENT ON TABLE public.newsletter_emails_sent IS 'Tracks which emails were sent to which subscribers';
COMMENT ON COLUMN public.newsletter_emails_sent.subscriber_id IS 'Reference to the subscriber';
COMMENT ON COLUMN public.newsletter_emails_sent.email_type IS 'Type of email: welcome, newsletter, announcement, etc.';
COMMENT ON COLUMN public.newsletter_emails_sent.articles_included IS 'Array of article IDs/slugs included in the email';
COMMENT ON COLUMN public.newsletter_emails_sent.metadata IS 'Additional metadata about the email';

-- Helper function to get articles not yet sent to a subscriber
CREATE OR REPLACE FUNCTION get_unsent_articles_for_subscriber(
    p_subscriber_id BIGINT,
    p_limit INTEGER DEFAULT 3
)
RETURNS TABLE (
    id BIGINT,
    title TEXT,
    slug TEXT,
    excerpt TEXT,
    hero_image TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        bp.id,
        bp.title,
        bp.slug,
        bp.excerpt,
        bp.hero_image
    FROM blog_posts bp
    WHERE 
        bp.language = 'en'
        AND bp.is_published = true
        AND NOT EXISTS (
            SELECT 1 
            FROM newsletter_emails_sent nes
            WHERE nes.subscriber_id = p_subscriber_id
            AND nes.articles_included @> jsonb_build_array(bp.slug)
        )
    ORDER BY bp.published_date DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION get_unsent_articles_for_subscriber IS 'Returns articles that have not been sent to a specific subscriber yet';
