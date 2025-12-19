'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

/**
 * Logout action - signs out the user from Supabase
 */
export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect('/admin/login');
}
