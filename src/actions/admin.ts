'use server';

import { createClient } from '@/lib/supabase/server';

/**
 * Check if the current user is an admin
 */
export async function isAdmin(): Promise<boolean> {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return false;
        }

        const { data: adminUser } = await supabase
            .from('admin_users')
            .select('id')
            .eq('id', user.id)
            .single();

        return !!adminUser;
    } catch (error) {
        console.error('Error checking admin status:', error);
        return false;
    }
}

/**
 * Require admin authentication - throws error if not admin
 * Use this at the start of admin-only server actions
 */
export async function requireAdmin() {
    const admin = await isAdmin();

    if (!admin) {
        throw new Error('Unauthorized: Admin access required');
    }
}

/**
 * Get the current admin user's profile
 */
export async function getAdminProfile() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return null;
        }

        const { data: adminUser, error } = await supabase
            .from('admin_users')
            .select('*')
            .eq('id', user.id)
            .single();

        if (error || !adminUser) {
            return null;
        }

        return {
            ...adminUser,
            email: user.email,
        };
    } catch (error) {
        console.error('Error fetching admin profile:', error);
        return null;
    }
}

/**
 * Update admin's last login timestamp
 */
export async function updateLastLogin() {
    try {
        const supabase = await createClient();

        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return { success: false };
        }

        const { error } = await supabase
            .from('admin_users')
            .update({ last_login: new Date().toISOString() })
            .eq('id', user.id);

        if (error) {
            console.error('Error updating last login:', error);
            return { success: false };
        }

        return { success: true };
    } catch (error) {
        console.error('Error in updateLastLogin:', error);
        return { success: false };
    }
}

/**
 * Get current authenticated user (admin or not)
 */
export async function getCurrentUser() {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();
        return user;
    } catch (error) {
        console.error('Error getting current user:', error);
        return null;
    }
}
