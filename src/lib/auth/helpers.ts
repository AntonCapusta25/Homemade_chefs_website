import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

/**
 * Get the current authenticated user (server-side)
 */
export async function getCurrentUser() {
    const supabase = await createServerClient()
    const { data: { user }, error } = await supabase.auth.getUser()

    if (error || !user) {
        return null
    }

    return user
}

/**
 * Get the current chef profile (server-side)
 */
export async function getCurrentChef() {
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
        return null
    }

    const { data: chef, error: chefError } = await supabase
        .from('chef_users')
        .select('*')
        .eq('id', user.id)
        .single()

    if (chefError) {
        return null
    }

    return chef
}

/**
 * Check if user is authenticated (server-side)
 */
export async function isAuthenticated(): Promise<boolean> {
    const user = await getCurrentUser()
    return !!user
}

/**
 * Sign out (client-side)
 */
export async function signOut() {
    const supabase = createBrowserClient()
    await supabase.auth.signOut()
}

/**
 * Get current user (client-side)
 */
export async function getCurrentUserClient() {
    const supabase = createBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
}

/**
 * Get current chef profile (client-side)
 */
export async function getCurrentChefClient() {
    const supabase = createBrowserClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return null
    }

    const { data: chef } = await supabase
        .from('chef_users')
        .select('*')
        .eq('id', user.id)
        .single()

    return chef
}
