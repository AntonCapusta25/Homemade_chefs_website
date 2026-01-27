-- =====================================================
-- CHEF AUTHENTICATION SYSTEM
-- =====================================================
-- Creates tables and policies for invite-based chef authentication
-- Run this in Supabase SQL Editor
-- =====================================================

-- =====================================================
-- 1. CHEF USERS TABLE
-- =====================================================
-- Stores chef profile information linked to Supabase Auth

CREATE TABLE IF NOT EXISTS public.chef_users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ,
    metadata JSONB DEFAULT '{}'::jsonb
);

COMMENT ON TABLE public.chef_users IS 'Chef profiles linked to Supabase Auth users';
COMMENT ON COLUMN public.chef_users.id IS 'References auth.users(id) from Supabase Auth';
COMMENT ON COLUMN public.chef_users.metadata IS 'Additional chef information (company, specialties, etc.)';

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_chef_users_email ON public.chef_users(email);

-- =====================================================
-- 2. CHEF INVITES TABLE
-- =====================================================
-- Manages invite tokens with expiration and usage tracking

CREATE TABLE IF NOT EXISTS public.chef_invites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    token UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '7 days'),
    used_at TIMESTAMPTZ,
    created_by_user_id UUID REFERENCES auth.users(id),
    metadata JSONB DEFAULT '{}'::jsonb
);

COMMENT ON TABLE public.chef_invites IS 'Invite tokens for chef onboarding';
COMMENT ON COLUMN public.chef_invites.token IS 'Unique invite token sent via email';
COMMENT ON COLUMN public.chef_invites.expires_at IS 'Invite expiration (default 7 days)';
COMMENT ON COLUMN public.chef_invites.used_at IS 'Timestamp when invite was accepted (NULL if unused)';
COMMENT ON COLUMN public.chef_invites.created_by_user_id IS 'Admin user who created the invite';

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_chef_invites_token ON public.chef_invites(token);
CREATE INDEX IF NOT EXISTS idx_chef_invites_email ON public.chef_invites(email);
CREATE INDEX IF NOT EXISTS idx_chef_invites_used ON public.chef_invites(used_at) WHERE used_at IS NULL;

-- =====================================================
-- 3. ROW LEVEL SECURITY POLICIES
-- =====================================================

-- Enable RLS on chef_users
ALTER TABLE public.chef_users ENABLE ROW LEVEL SECURITY;

-- Policy: Chefs can view their own profile
CREATE POLICY "Chefs can view own profile"
ON public.chef_users
FOR SELECT
TO authenticated
USING (auth.uid() = id);

-- Policy: Chefs can update their own profile
CREATE POLICY "Chefs can update own profile"
ON public.chef_users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Policy: Service role can manage all chef users (for Edge Functions)
CREATE POLICY "Service role can manage chef users"
ON public.chef_users
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- Enable RLS on chef_invites
ALTER TABLE public.chef_invites ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can validate invite tokens (needed for signup)
CREATE POLICY "Anyone can validate invite tokens"
ON public.chef_invites
FOR SELECT
TO anon, authenticated
USING (true);

-- Policy: Service role can manage invites (for Edge Functions)
CREATE POLICY "Service role can manage invites"
ON public.chef_invites
FOR ALL
TO service_role
USING (true)
WITH CHECK (true);

-- =====================================================
-- 4. DATABASE FUNCTIONS
-- =====================================================

-- Function to auto-update updated_at timestamp for chef_users
CREATE OR REPLACE FUNCTION update_chef_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update updated_at
DROP TRIGGER IF EXISTS update_chef_users_updated_at_trigger ON public.chef_users;
CREATE TRIGGER update_chef_users_updated_at_trigger
    BEFORE UPDATE ON public.chef_users
    FOR EACH ROW
    EXECUTE FUNCTION update_chef_users_updated_at();

-- Function to check if invite is valid
CREATE OR REPLACE FUNCTION is_invite_valid(invite_token UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.chef_invites 
        WHERE token = invite_token 
        AND used_at IS NULL 
        AND expires_at > NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark invite as used
CREATE OR REPLACE FUNCTION mark_invite_used(invite_token UUID)
RETURNS VOID AS $$
BEGIN
    UPDATE public.chef_invites 
    SET used_at = NOW() 
    WHERE token = invite_token;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 5. HELPER VIEWS (OPTIONAL)
-- =====================================================

-- View for active (unused, non-expired) invites
CREATE OR REPLACE VIEW public.active_chef_invites AS
SELECT 
    id,
    email,
    full_name,
    token,
    created_at,
    expires_at,
    metadata
FROM public.chef_invites
WHERE used_at IS NULL 
AND expires_at > NOW();

COMMENT ON VIEW public.active_chef_invites IS 'Active chef invites (unused and not expired)';

-- =====================================================
-- CHEF AUTHENTICATION SCHEMA COMPLETE
-- =====================================================
-- Next: Deploy Edge Functions for invite management
-- =====================================================
