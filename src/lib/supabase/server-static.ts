import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Create a Supabase client for static generation contexts
 * This client doesn't use cookies and is suitable for build-time data fetching
 * where the Next.js cookies() API is not available.
 * 
 * Use this client in:
 * - generateStaticParams()
 * - generateMetadata() when called during build
 * - Any other build-time data fetching
 * 
 * For runtime requests, use createClient() from './server' instead.
 */
export function createStaticClient() {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
}
