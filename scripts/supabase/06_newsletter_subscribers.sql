-- Newsletter subscribers table
CREATE TABLE IF NOT EXISTS public.newsletter_subscribers (
    id BIGSERIAL PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    source TEXT DEFAULT 'website',
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_newsletter_email ON public.newsletter_subscribers(email);
CREATE INDEX IF NOT EXISTS idx_newsletter_active ON public.newsletter_subscribers(is_active);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- Policy: Allow anyone to subscribe (insert)
CREATE POLICY "Anyone can subscribe to newsletter"
ON public.newsletter_subscribers
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Only authenticated users can view subscribers
CREATE POLICY "Only authenticated users can view subscribers"
ON public.newsletter_subscribers
FOR SELECT
TO authenticated
USING (true);

-- Comments
COMMENT ON TABLE public.newsletter_subscribers IS 'Stores newsletter subscriber emails';
COMMENT ON COLUMN public.newsletter_subscribers.email IS 'Subscriber email address';
COMMENT ON COLUMN public.newsletter_subscribers.is_active IS 'Whether subscription is active';
COMMENT ON COLUMN public.newsletter_subscribers.source IS 'Where the subscription came from';
